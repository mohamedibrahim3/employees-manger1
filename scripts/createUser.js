const { prisma } = require("../db/prisma.js");
const bcrypt = require("bcryptjs");

async function main() {
  const password = await bcrypt.hash("123456", 10);
  const user = await prisma.user.create({
    data: {
      username: "admin",
      password,
    },
  });

  console.log("User created:", user);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
