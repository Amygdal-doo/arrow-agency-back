import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const SUPER_ADMIN_EMAIL = "super_admin@admin.com";
const USER_EMAIL = "user@user.com";

const DEV_PASSWORD =
  "38ff6f3322dd5b9b2e0d8bef6204ccca:d9c45851f96108d2da4282687c6cde4d1afca0de7b89991b6da702f3ab16b182deb4d317950a77d83b6c7732e43dd8d9088aad46b13fd619ffcf81b30f2e7364";
async function main() {
  const SUPER_ADMIN = await prisma.user.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    update: {},
    create: {
      email: SUPER_ADMIN_EMAIL,
      firstName: "Harun",
      lastName: "Ibrahimovic",
      role: Role.SUPER_ADMIN,
      password: DEV_PASSWORD,
      profile: {
        create: {
          address: "Istanbul",
          phoneNumber: "1234567890",
        },
      },
      // isEmailConfirmed: true,
    },
  });
  console.log("User created with id: ", SUPER_ADMIN.id);

  const USER = await prisma.user.upsert({
    where: { email: USER_EMAIL },
    update: {},
    create: {
      email: USER_EMAIL,
      firstName: "Aisa",
      lastName: "Bektas",
      role: Role.USER,
      password: DEV_PASSWORD,
      profile: {
        create: {
          address: "Istanbul",
          phoneNumber: "1234567890",
        },
      },
      // isEmailConfirmed: true,
    },
  });

  console.log("User created with id: ", USER.id);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
