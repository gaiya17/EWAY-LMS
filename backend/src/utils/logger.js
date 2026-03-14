const prisma = require("../config/db");

async function logActivity(input) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: input.userId || null,
        action: input.action,
        entityType: input.entityType || null,
        entityId: input.entityId || null,
        description: input.description || null,
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
        metadata: input.metadata || undefined
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error("Failed to write activity log:", error.message);
    }
  }
}

module.exports = {
  logActivity
};
