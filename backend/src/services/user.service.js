const { RoleCode } = require("@prisma/client");
const prisma = require("../config/db");
const { logActivity } = require("../utils/logger");

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: true,
      studentProfile: true,
      teacherProfile: true,
      staffProfile: true,
      adminProfile: true,
    }
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const profile = user.studentProfile || user.teacherProfile || user.staffProfile || user.adminProfile;
  return {
    id: user.id,
    email: user.email,
    role: user.role.code.toLowerCase(),
    status: user.status,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    profile
  };
}

async function updateProfile(userId, role, payload, requestMeta) {
  // Check for unique phone if provided
  if (payload.phone) {
    const existingPhoneInStudent = await prisma.studentProfile.findFirst({ where: { phone: payload.phone, userId: { not: userId } } });
    const existingPhoneInTeacher = await prisma.teacherProfile.findFirst({ where: { phone: payload.phone, userId: { not: userId } } });
    const existingPhoneInStaff = await prisma.staffProfile.findFirst({ where: { phone: payload.phone, userId: { not: userId } } });
    const existingPhoneInAdmin = await prisma.adminProfile.findFirst({ where: { phone: payload.phone, userId: { not: userId } } });
    
    if (existingPhoneInStudent || existingPhoneInTeacher || existingPhoneInStaff || existingPhoneInAdmin) {
       const error = new Error("Phone number is already in use by another user");
       error.statusCode = 409;
       throw error;
    }
  }

  const roleCodeStr = (typeof role === 'object' && role !== null ? role.code : role).toUpperCase();
  let updatedProfile;

  if (roleCodeStr === RoleCode.STUDENT) {
    const updateData = {};
    if (payload.firstName) updateData.firstName = payload.firstName;
    if (payload.lastName) updateData.lastName = payload.lastName;
    if (payload.phone !== undefined) updateData.phone = payload.phone;
    if (payload.gender) updateData.gender = payload.gender;
    if (payload.birthday) updateData.birthday = new Date(payload.birthday);

    updatedProfile = await prisma.studentProfile.update({
      where: { userId },
      data: updateData
    });
  } else if (roleCodeStr === RoleCode.TEACHER) {
    const updateData = {};
    if (payload.firstName) updateData.firstName = payload.firstName;
    if (payload.lastName) updateData.lastName = payload.lastName;
    if (payload.phone !== undefined) updateData.phone = payload.phone;

    updatedProfile = await prisma.teacherProfile.update({
      where: { userId },
      data: updateData
    });
  } else if (roleCodeStr === RoleCode.STAFF) {
    const updateData = {};
    if (payload.firstName) updateData.firstName = payload.firstName;
    if (payload.lastName) updateData.lastName = payload.lastName;
    if (payload.phone !== undefined) updateData.phone = payload.phone;

    updatedProfile = await prisma.staffProfile.update({
      where: { userId },
      data: updateData
    });
  } else if (roleCodeStr === RoleCode.ADMIN) {
    const updateData = {};
    if (payload.firstName) updateData.firstName = payload.firstName;
    if (payload.lastName) updateData.lastName = payload.lastName;
    if (payload.phone !== undefined) updateData.phone = payload.phone;

    updatedProfile = await prisma.adminProfile.update({
      where: { userId },
      data: updateData
    });
  } else {
    throw new Error("Invalid user role");
  }

  await logActivity({
    userId,
    action: "USER_UPDATE_PROFILE",
    entityType: "PROFILE",
    entityId: updatedProfile.id,
    description: "User updated their profile",
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent
  });

  return updatedProfile;
}

module.exports = {
  getProfile,
  updateProfile
};
