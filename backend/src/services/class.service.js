const prisma = require("../config/db");
const { ApprovalStatus } = require("@prisma/client");
const { logActivity } = require("../utils/logger");

async function createCourse(teacherId, data, requestMeta) {
  const teacher = await prisma.teacherProfile.findUnique({
    where: { userId: teacherId },
  });

  if (!teacher) {
    const error = new Error("Teacher profile not found");
    error.statusCode = 404;
    throw error;
  }

  const course = await prisma.course.create({
    data: {
      ...data,
      teacherId: teacher.id,
      status: ApprovalStatus.PENDING,
    },
  });

  await logActivity({
    userId: teacherId,
    action: "CREATE_COURSE",
    entityType: "COURSE",
    entityId: course.id,
    description: `Teacher created a new course: ${course.name}`,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent
  });

  return course;
}

async function getAllCourses() {
  return await prisma.course.findMany({
    include: {
      teacher: true,
    }
  });
}

async function createClass(teacherId, data, requestMeta) {
  const teacher = await prisma.teacherProfile.findUnique({
    where: { userId: teacherId },
  });

  if (!teacher) {
    const error = new Error("Teacher profile not found");
    error.statusCode = 404;
    throw error;
  }

  const newClass = await prisma.class.create({
    data: {
      ...data,
      teacherId: teacher.id,
      status: ApprovalStatus.PENDING,
    },
  });

  await logActivity({
    userId: teacherId,
    action: "CREATE_CLASS",
    entityType: "CLASS",
    entityId: newClass.id,
    description: `Teacher created a new class: ${newClass.name}`,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent
  });

  return newClass;
}

async function approveEntity(adminId, entityType, entityId, status, requestMeta) {
  let updatedEntity;
  if (entityType === 'class') {
    updatedEntity = await prisma.class.update({
      where: { id: entityId },
      data: { status },
    });
  } else if (entityType === 'course') {
    updatedEntity = await prisma.course.update({
      where: { id: entityId },
      data: { status },
    });
  } else if (entityType === 'studypack') {
    updatedEntity = await prisma.studyPack.update({
      where: { id: entityId },
      data: { status },
    });
  } else {
    throw new Error("Invalid entity type for approval");
  }

  await logActivity({
    userId: adminId,
    action: `APPROVE_${entityType.toUpperCase()}`,
    entityType: entityType.toUpperCase(),
    entityId: entityId,
    description: `Admin ${status.toLowerCase()} ${entityType}: ${updatedEntity.name}`,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent
  });

  return updatedEntity;
}

async function getApprovedClasses() {
  return await prisma.class.findMany({
    where: { status: ApprovalStatus.APPROVED },
    include: {
      course: true,
      teacher: true,
    },
  });
}

async function getPendingClasses() {
  return await prisma.class.findMany({
    where: { status: ApprovalStatus.PENDING },
    include: {
      course: true,
      teacher: true,
    },
  });
}

async function getTeacherClasses(teacherUserId) {
  const teacher = await prisma.teacherProfile.findUnique({
    where: { userId: teacherUserId },
  });

  if (!teacher) return [];

  return await prisma.class.findMany({
    where: { teacherId: teacher.id },
    include: {
      course: true,
      enrollments: true,
      assignments: true,
      notes: true,
      links: true,
    },
  });
}

async function addResourceToClass(teacherId, classId, resourceType, data, requestMeta) {
  const teacher = await prisma.teacherProfile.findUnique({
    where: { userId: teacherId },
  });

  if (!teacher) {
    const error = new Error("Teacher profile not found");
    error.statusCode = 404;
    throw error;
  }

  const targetClass = await prisma.class.findFirst({
    where: { id: classId, teacherId: teacher.id },
  });

  if (!targetClass) {
    const error = new Error("Class not found or unauthorized");
    error.statusCode = 404;
    throw error;
  }

  if (targetClass.status !== ApprovalStatus.APPROVED) {
    const error = new Error("Cannot add resources to a class that is not approved");
    error.statusCode = 403;
    throw error;
  }

  let resource;
  if (resourceType === 'assignment') {
    if (data.dueDate) data.dueDate = new Date(data.dueDate);
    resource = await prisma.assignment.create({ data: { ...data, classId } });
  } else if (resourceType === 'note') {
    resource = await prisma.note.create({ data: { ...data, classId } });
  } else if (resourceType === 'link') {
    resource = await prisma.classLink.create({ data: { ...data, classId } });
  }

  await logActivity({
    userId: teacherId,
    action: `ADD_${resourceType.toUpperCase()}`,
    entityType: resourceType.toUpperCase(),
    entityId: resource.id,
    description: `Teacher added ${resourceType} to class ${targetClass.name}`,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent
  });

  return resource;
}

async function getStudentClasses(userId) {
  // Find student record
  const student = await prisma.student.findUnique({
    where: { userId }
  });

  if (!student) {
    throw new Error('Student record not found');
  }

  return await prisma.class.findMany({
    where: {
      enrollments: {
        some: {
          studentId: student.id
        }
      },
      status: 'APPROVED'
    },
    include: {
      course: true,
      teacher: {
        include: {
          user: {
            select: { name: true }
          }
        }
      },
      resources: true
    }
  });
}

module.exports = {
  createCourse,
  getAllCourses,
  createClass,
  getPendingClasses,
  getApprovedClasses,
  approveEntity,
  getTeacherClasses,
  addResourceToClass,
  getStudentClasses
};
