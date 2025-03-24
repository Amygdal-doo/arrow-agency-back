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

  // Seed JobCategory
  const jobCategories = [
    {
      code: "ENG",
      name: "Engineering",
      description: "Responsible for product development and maintenance.",
    },
    {
      code: "MKT",
      name: "Marketing",
      description: "Handles product promotion and market research.",
    },
    {
      code: "SALES",
      name: "Sales",
      description: "Manages sales operations and customer relationships.",
    },
    {
      code: "HR",
      name: "Human Resources",
      description: "Oversees employee management and organizational culture.",
    },
    {
      code: "FIN",
      name: "Finance",
      description: "Manages financial planning, accounting, and reporting.",
    },
  ];

  for (const category of jobCategories) {
    await prisma.jobCategory.create({ data: category });
  }

  // Seed JobPosition
  const jobPositions = [
    {
      code: "SWE",
      name: "Software Engineer",
      description: "Designs, develops, and tests software applications.",
    },
    {
      code: "HWE",
      name: "Hardware Engineer",
      description: "Designs and tests hardware components.",
    },
    {
      code: "QAE",
      name: "Quality Assurance Engineer",
      description: "Ensures product quality through testing and validation.",
    },
    {
      code: "MKC",
      name: "Marketing Coordinator",
      description: "Assists in marketing campaigns and events.",
    },
    {
      code: "SEO",
      name: "SEO Specialist",
      description: "Optimizes website content for search engines.",
    },
    {
      code: "SR",
      name: "Sales Representative",
      description: "Sells products and services to customers.",
    },
    {
      code: "AM",
      name: "Account Manager",
      description: "Manages client accounts and relationships.",
    },
    {
      code: "HRG",
      name: "HR Generalist",
      description:
        "Handles various HR tasks including recruitment and employee relations.",
    },
    {
      code: "REC",
      name: "Recruiter",
      description: "Sources and hires new employees.",
    },
    {
      code: "FA",
      name: "Financial Analyst",
      description: "Analyzes financial data and prepares reports.",
    },
    {
      code: "ACC",
      name: "Accountant",
      description: "Manages accounting records and financial statements.",
    },
    {
      code: "PM",
      name: "Product Manager",
      description: "Oversees product development and strategy.",
    },
    {
      code: "UXD",
      name: "UX Designer",
      description: "Designs user experiences for products.",
    },
    {
      code: "DA",
      name: "Data Analyst",
      description: "Analyzes data to provide insights.",
    },
    {
      code: "CTO",
      name: "Chief Technology Officer",
      description: "Leads the technology strategy and innovation.",
    },
  ];

  for (const position of jobPositions) {
    await prisma.jobPosition.create({ data: position });
  }

  console.log("Seeding completed.");
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
