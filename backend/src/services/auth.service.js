const crypto = require("crypto");
const { RoleCode, ResetTokenStatus, UserStatus } = require("@prisma/client");
const prisma = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/hash");
const { signAccessToken } = require("../utils/jwt");
const { sendMail } = require("../utils/mailer");
const { logActivity } = require("../utils/logger");

function getProfileFromUser(user) {
  const profile =
    user.studentProfile ||
    user.teacherProfile ||
    user.staffProfile ||
    user.adminProfile ||
    null;

  return {
    id: user.id,
    email: user.email,
    role: user.role.code.toLowerCase(),
    status: user.status.toLowerCase(),
    lastLoginAt: user.lastLoginAt,
    profile
  };
}

async function ensureRole(code, name) {
  return prisma.role.upsert({
    where: { code },
    update: { name },
    create: { code, name }
  });
}

async function seedBaseRoles() {
  await Promise.all([
    ensureRole(RoleCode.STUDENT, "Student"),
    ensureRole(RoleCode.TEACHER, "Teacher"),
    ensureRole(RoleCode.STAFF, "Staff"),
    ensureRole(RoleCode.ADMIN, "Admin")
  ]);
}

async function registerStudent(payload, requestMeta) {
  await seedBaseRoles();

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (existingUser) {
    const error = new Error("An account with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const studentRole = await prisma.role.findUnique({
    where: { code: RoleCode.STUDENT }
  });

  const passwordHash = await hashPassword(payload.password);

  const user = await prisma.user.create({
    data: {
      email: payload.email,
      passwordHash,
      roleId: studentRole.id,
      status: UserStatus.UNVERIFIED,
      studentProfile: {
        create: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: payload.phone,
          gender: payload.gender,
          birthday: new Date(payload.birthday)
        }
      }
    },
    include: {
      role: true,
      studentProfile: true
    }
  });

  await logActivity({
    userId: user.id,
    action: "AUTH_REGISTER",
    entityType: "USER",
    entityId: user.id,
    description: "Student self-registration completed",
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent
  });

  const verificationToken = crypto.randomBytes(32).toString("hex");

  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }
  });

  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?page=verify-email&token=${verificationToken}`;

  await sendMail({
    to: user.email,
    subject: "Verify your EWAY LMS account",
    text: `Please verify your email address by clicking the following link: ${verificationUrl}`,
    html: `<p>Please verify your email address by clicking the following link:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`
  });

  // We don't return a token here to force the user to login after verification
  return {
    message: "Registration successful. Please check your email to verify your account.",
    user: getProfileFromUser(user)
  };
}

async function login(payload, requestMeta) {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    include: {
      role: true,
      studentProfile: true,
      teacherProfile: true,
      staffProfile: true,
      adminProfile: true
    }
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (user.status === UserStatus.UNVERIFIED) {
    const error = new Error("Please verify your email before logging in");
    error.statusCode = 403;
    throw error;
  }

  const passwordMatches = await comparePassword(payload.password, user.passwordHash);

  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
    include: {
      role: true,
      studentProfile: true,
      teacherProfile: true,
      staffProfile: true,
      adminProfile: true
    }
  });

  await logActivity({
    userId: updatedUser.id,
    action: "AUTH_LOGIN",
    entityType: "USER",
    entityId: updatedUser.id,
    description: "User logged into the system",
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent
  });

  const token = signAccessToken({
    sub: updatedUser.id,
    role: updatedUser.role.code,
    email: updatedUser.email
  });

  return {
    token,
    user: getProfileFromUser(updatedUser)
  };
}

async function sendPasswordResetCode(payload) {
  const user = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (!user) {
    return {
      message: "If the account exists, a reset code has been sent"
    };
  }

  await prisma.passwordResetToken.updateMany({
    where: {
      userId: user.id,
      status: ResetTokenStatus.PENDING
    },
    data: {
      status: ResetTokenStatus.EXPIRED
    }
  });

  const code = crypto.randomInt(100000, 999999).toString();

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    }
  });

  await sendMail({
    to: user.email,
    subject: "EWAY LMS password reset code",
    text: `Your EWAY LMS password reset code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your EWAY LMS password reset code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`
  });

  return {
    message: "If the account exists, a reset code has been sent"
  };
}

async function verifyResetCode(payload) {
  const user = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (!user) {
    const error = new Error("Invalid reset code");
    error.statusCode = 400;
    throw error;
  }

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      token: payload.code,
      status: ResetTokenStatus.PENDING,
      expiresAt: {
        gt: new Date()
      }
    }
  });

  if (!resetToken) {
    const error = new Error("Invalid or expired reset code");
    error.statusCode = 400;
    throw error;
  }

  return {
    message: "Reset code verified"
  };
}

async function resetPassword(payload, requestMeta) {
  const user = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (!user) {
    const error = new Error("Invalid reset request");
    error.statusCode = 400;
    throw error;
  }

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      token: payload.code,
      status: ResetTokenStatus.PENDING,
      expiresAt: {
        gt: new Date()
      }
    }
  });

  if (!resetToken) {
    const error = new Error("Invalid or expired reset code");
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await hashPassword(payload.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { status: ResetTokenStatus.USED }
    }),
    prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        status: ResetTokenStatus.PENDING
      },
      data: {
        status: ResetTokenStatus.EXPIRED
      }
    })
  ]);

  await logActivity({
    userId: user.id,
    action: "AUTH_RESET_PASSWORD",
    entityType: "USER",
    entityId: user.id,
    description: "User reset account password",
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent
  });

  return {
    message: "Password reset successfully"
  };
}

async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: true,
      studentProfile: true,
      teacherProfile: true,
      staffProfile: true,
      adminProfile: true
    }
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return getProfileFromUser(user);
}

async function verifyEmail(payload) {
  const resetToken = await prisma.emailVerificationToken.findUnique({
    where: { token: payload.token },
    include: { user: true }
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    const error = new Error("Invalid or expired verification token");
    error.statusCode = 400;
    throw error;
  }

  if (resetToken.user.status === UserStatus.ACTIVE) {
    const error = new Error("Email is already verified");
    error.statusCode = 400;
    throw error;
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { status: UserStatus.ACTIVE }
    }),
    prisma.emailVerificationToken.delete({
      where: { id: resetToken.id }
    })
  ]);

  return {
    message: "Email verified successfully"
  };
}

async function sendPasswordSetupLink(payload) {
  const user = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (!user) {
    return {
      message: "If the account exists, a setup link has been sent"
    };
  }

  // Invalidate old tokens
  await prisma.passwordResetToken.updateMany({
    where: {
      userId: user.id,
      status: ResetTokenStatus.PENDING
    },
    data: {
      status: ResetTokenStatus.EXPIRED
    }
  });

  // Generate a long secure token
  const token = crypto.randomBytes(32).toString("hex");

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours for initial setup
    }
  });

  const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const setupUrl = `${frontendUrl}/?page=setup-password&token=${token}&email=${encodeURIComponent(user.email)}`;

  await sendMail({
    to: user.email,
    subject: "Welcome to EWAY LMS - Set Your Password",
    text: `Welcome to EWAY LMS! Please set your password by clicking the following link: ${setupUrl}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to EWAY LMS</h2>
        <p>Your account has been created by an administrator. Please click the button below to set your password and access your dashboard.</p>
        <div style="margin: 30px 0;">
          <a href="${setupUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Set My Password</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6366f1;">${setupUrl}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `
  });

  return {
    message: "If the account exists, a setup link has been sent"
  };
}

async function verifySetupToken(payload) {
  const user = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (!user) {
    const error = new Error("Invalid setup link");
    error.statusCode = 400;
    throw error;
  }

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      token: payload.token,
      status: ResetTokenStatus.PENDING,
      expiresAt: {
        gt: new Date()
      }
    }
  });

  if (!resetToken) {
    const error = new Error("Invalid or expired setup link");
    error.statusCode = 400;
    throw error;
  }

  return {
    message: "Setup token verified"
  };
}

async function setupPassword(payload, requestMeta) {
  const user = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (!user) {
    const error = new Error("Invalid setup request");
    error.statusCode = 400;
    throw error;
  }

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      token: payload.token,
      status: ResetTokenStatus.PENDING,
      expiresAt: {
        gt: new Date()
      }
    }
  });

  if (!resetToken) {
    const error = new Error("Invalid or expired setup link");
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await hashPassword(payload.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { status: ResetTokenStatus.USED }
    }),
    prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        status: ResetTokenStatus.PENDING
      },
      data: {
        status: ResetTokenStatus.EXPIRED
      }
    })
  ]);

  await logActivity({
    userId: user.id,
    action: "AUTH_SETUP_PASSWORD",
    entityType: "USER",
    entityId: user.id,
    description: "User completed initial password setup",
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent
  });

  return {
    message: "Password set successfully. You can now log in."
  };
}

module.exports = {
  seedBaseRoles,
  registerStudent,
  login,
  sendPasswordResetCode,
  sendPasswordSetupLink,
  verifyResetCode,
  verifySetupToken,
  resetPassword,
  setupPassword,
  getCurrentUser,
  verifyEmail
};
