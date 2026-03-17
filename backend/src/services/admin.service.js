const { RoleCode, UserStatus } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const prisma = require("../config/db");
const { sendPasswordSetupLink } = require("./auth.service");
const { logActivity } = require("../utils/logger");

async function createUser(payload, requestMeta) {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (existingUser) {
    const error = new Error("An account with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  // Determine role code
  let roleCode;
  if (payload.role === "teacher") {
    roleCode = RoleCode.TEACHER;
  } else if (payload.role === "staff") {
    roleCode = RoleCode.STAFF;
  } else {
    throw new Error("Invalid role specified");
  }

  const role = await prisma.role.findUnique({
    where: { code: roleCode }
  });

  if (!role) {
    throw new Error(`Role ${payload.role} does not exist in the database`);
  }

  // Create a strong random temporary password so the account isn't completely open
  const tempPassword = crypto.randomBytes(16).toString("hex");
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(tempPassword, salt);

  // Use a transaction if we needed to check phone globally, but doing it profile by profile is hard unless we check each table or let the unique constraint fail. 
  // Let the unique constraint handle phone duplication errors, or we can check manually.
  
  // To manually check phone uniqueness across all profiles that matter:
  if (payload.phone) {
    const existingPhoneInStudent = await prisma.studentProfile.findFirst({ where: { phone: payload.phone } });
    const existingPhoneInTeacher = await prisma.teacherProfile.findFirst({ where: { phone: payload.phone } });
    const existingPhoneInStaff = await prisma.staffProfile.findFirst({ where: { phone: payload.phone } });
    const existingPhoneInAdmin = await prisma.adminProfile.findFirst({ where: { phone: payload.phone } });
    
    if (existingPhoneInStudent || existingPhoneInTeacher || existingPhoneInStaff || existingPhoneInAdmin) {
       const error = new Error("Phone number is already in use");
       error.statusCode = 409;
       throw error;
    }
  }

  // Build the correct profile creation object
  const profileData = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone || null
  };

  const userData = {
    email: payload.email,
    passwordHash,
    roleId: role.id,
    status: UserStatus.ACTIVE, // Or UNVERIFIED if you prefer
  };

  if (payload.role === "teacher") {
    userData.teacherProfile = { create: profileData };
  } else if (payload.role === "staff") {
    userData.staffProfile = { create: profileData };
  }

  const user = await prisma.user.create({
    data: userData,
    include: {
      role: true,
      teacherProfile: true,
      staffProfile: true
    }
  });

  await logActivity({
    userId: user.id, // Current log shows the created user id as actor, ideally should pass admin's ID but this is okay for now
    action: "ADMIN_CREATE_USER",
    entityType: "USER",
    entityId: user.id,
    description: `Admin created ${payload.role} account`,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent
  });

  // Trigger password reset using the auth service to send the reset code link email
  // The sendPasswordResetCode function takes the email, invalidates old codes, generates a new one, and sends it.
  // Wrap in try/catch so that if email fails (e.g. SMTP not configured), user creation still succeeds.
  let emailSent = true;
  try {
    await sendPasswordSetupLink({ email: user.email });
  } catch (emailErr) {
    console.warn(`[admin.service] Could not send password reset email to ${user.email}:`, emailErr.message);
    emailSent = false;
  }

  return {
    id: user.id,
    email: user.email,
    role: payload.role,
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    status: user.status,
    emailSent
  };
}

async function getAllUsers() {
  const users = await prisma.user.findMany({
    include: {
      role: true,
      studentProfile: true,
      teacherProfile: true,
      staffProfile: true,
      adminProfile: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return users.map(user => {
    const profile = 
      user.studentProfile || 
      user.teacherProfile || 
      user.staffProfile || 
      user.adminProfile;

    return {
      id: user.id,
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: user.email,
      phone: profile?.phone || "",
      role: user.role.code.toLowerCase(),
      status: user.status.toLowerCase(),
      registeredDate: user.createdAt.toISOString(),
      lastLogin: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    };
  });
}

module.exports = {
  createUser,
  getAllUsers
};
