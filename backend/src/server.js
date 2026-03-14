const app = require("./app");
const prisma = require("./config/db");
const env = require("./config/env");
const { seedBaseRoles } = require("./services/auth.service");

async function bootstrap() {
  await prisma.$connect();
  await seedBaseRoles();

  app.listen(env.port, () => {
    console.log(`EWAY LMS backend running on port ${env.port}`);
  });
}

bootstrap().catch(async (error) => {
  console.error("Failed to start backend:", error);
  await prisma.$disconnect();
  process.exit(1);
});
