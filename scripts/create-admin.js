// Creates or updates an admin user. Requires DATABASE_URL in env.
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "AdminPass123!";
  const name = process.env.ADMIN_NAME || "Admin User";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      hashedPassword,
      role: "ADMIN",
    },
    create: {
      name,
      email,
      hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin upserted:", { id: user.id, email: user.email, role: user.role });
  console.log("Login with:", email, password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
