const bcrypt = require("bcryptjs");
const { PrismaClient, RoleCode, UserStatus } = require("@prisma/client");

const prisma = new PrismaClient();

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function ensureRole(code, name) {
  return prisma.role.upsert({
    where: { code },
    update: { name },
    create: { code, name }
  });
}

async function seedAdmin() {
  try {
    console.log("Seeding core roles...");
    await ensureRole(RoleCode.STUDENT, "Student");
    await ensureRole(RoleCode.TEACHER, "Teacher");
    await ensureRole(RoleCode.STAFF, "Staff");
    const adminRole = await ensureRole(RoleCode.ADMIN, "Admin");

    const email = "admin@eway.com";
    const password = "adminpassword123";

    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log(`Admin user ${email} already exists! Skipping creation.`);
      return;
    }

    console.log(`Creating Admin user ${email}...`);
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        roleId: adminRole.id,
        status: UserStatus.ACTIVE,
        adminProfile: {
          create: {
            firstName: "Super",
            lastName: "Admin",
            phone: "+94770000000"
          }
        }
      }
    });

    console.log("Admin user created successfully:", user.email);
    console.log("You can log in with:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
