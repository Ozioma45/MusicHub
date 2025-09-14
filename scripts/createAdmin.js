const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const username = "admin";
  const password = await bcrypt.hash("HackAdmin@9090", 10);

  await prisma.admin.create({
    data: { username, password },
  });

  console.log("✅ Admin created successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
