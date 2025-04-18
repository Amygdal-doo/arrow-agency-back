import { MonriCurrency, PrismaClient, Role } from "@prisma/client";

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
      name: "Engineering",
      description: "Responsible for product development and maintenance.",
    },
    {
      name: "Marketing",
      description: "Handles product promotion and market research.",
    },
    {
      name: "Sales",
      description: "Manages sales operations and customer relationships.",
    },
    {
      name: "Human Resources",
      description: "Oversees employee management and organizational culture.",
    },
    {
      name: "Finance",
      description: "Manages financial planning, accounting, and reporting.",
    },
    {
      name: "Fullstack",
      description: "Proficient in both front-end and back-end development.",
    },
    {
      name: "Frontend",
      description:
        "Responsible for developing the user interface and user experience.",
    },
    {
      name: "Backend",
      description:
        "Handles server-side logic, database integration, and API connectivity.",
    },
    {
      name: "Customer Support",
      description:
        "Responsible for providing customer assistance and resolving issues.",
    },
    {
      name: "DevOps",
      description:
        "Ensures the smooth operation of software systems, from development to deployment.",
    },
    {
      name: "Sales and Marketing",
      description: "Handles sales operations and customer relationships.",
    },
    {
      name: "Management and Finance",
      description: "Oversees financial planning, accounting, and reporting.",
    },
    {
      name: "Product",
      description: "Handles product development and maintenance.",
    },
    { name: "Other", description: "Other technical skills." },
  ];

  const skillsList = [
    "ADP",
    "Amazon Seller Central",
    "BambooHR",
    "Client Relationship Management",
    "Data Visualization",
    "Data Warehousing",
    "Editing",
    "Email Campaigns",
    "Excel Modeling",
    "Financial Advisory",
    "Looker",
    "Market Research",
    "Prototyping",
    "Relationship Building",
    "Risk Management",
    "SEO",
    "Stakeholder Communication",
    "Wealth Management",
    "3D Animation",
    "3D Modeling",
    "A/B Testing",
    "Accounting",
    "Ad Design",
    "Admin",
    "Adobe After Affects",
    "Adobe Creative Suite",
    "Adobe Illustrator",
    "Adobe InDesign",
    "Adobe Lightroom",
    "Adobe Photoshop",
    "Adobe Premiere",
    "Adobe XD",
    "AdWords",
    "Agile",
    "Agile Methodologies",
    "Agile/Scrum",
    "Ahrefs",
    "AI Consulting",
    "AI Content Creation",
    "AI Ethics and Responsible AI",
    "AI Governance",
    "AI Product Development",
    "AI Research",
    "AI Strategy",
    "AI Text-to-Speech",
    "AJAX",
    "Alpine.js",
    "Amazon",
    "Amazon ECS",
    "Analytics",
    "Analytics Tools",
    "Android",
    "AngularJS",
    "Animation",
    "Apache",
    "API",
    "API Development",
    "API Integration",
    "App Store Optimization",
    "Application Installations",
    "Architect",
    "Architecture",
    "Artificial Intelligence (AI)",
    "Audio Editing",
    "Automation Scripting",
    "AWS",
    "Azure",
    "Azure OpenAI",
    "Babel",
    "Backbone.js",
    "Backend",
    "Backlink Strategy",
    "Bamboo",
    "Bard",
    "Bash",
    "Behavior Change Coaching",
    "BERT",
    "BigQuery",
    "Blockchain",
    "Blog Writing",
    "Bookkeeping",
    "Bootstrap",
    "Branding",
    "Budget Management",
    "Budgeting",
    "Buffer",
    "Bug Tracking",
    "Bulma",
    "Business Valuation",
    "BuzzSumo",
    "C",
    "C#",
    "C++",
    "Cache",
    "Canva",
    "Case Management",
    "Cassandra",
    "Celery",
    "Chai",
    "Character Design",
    "Chatbots",
    "ChatGPT",
    "CI/CD Pipelines",
    "Cisco Systems",
    "Client Relations",
    "Client Retention",
    "Client Retention Strategies",
    "Clojure",
    "Cloud",
    "Cloud Forensics",
    "CMS",
    "Cold Calling",
    "Color Theory",
    "Communication Skills",
    "Community Growth",
    "Competitor Analysis",
    "Compliance",
    "Composition",
    "Computer Vision",
    "Configuration Management",
    "Conflict Resolution",
    "Consumer Behavior",
    "Containers",
    "Content Creation",
    "Content Planning",
    "Content Strategy",
    "Content Writing",
    "Continuous Integration",
    "Continuous Integration Servers",
    "Contract Drafting",
    "Contract Negotiation",
    "Convolutional Neural Network (CNN)",
    "Copywriting",
    "Corporate Law",
    "Corporate Tax",
    "Corporate Wellness Programs",
    "CRM",
    "CRM Integration",
    "CRM Systems",
    "Cross-Browser Development",
    "Cross-Selling",
    "Cryptocurrency",
    "CSS",
    "CSS Preprocessors",
    "Customer Relationship Management",
    "Customer Service",
    "Customer Support",
    "Cyber Security",
    "Cypress",
    "Dart",
    "Dashboard Creation",
    "Data",
    "Data Analysis",
    "Data Cleaning",
    "Data Engineering",
    "Data Entry",
    "Data Mining",
    "Data Preprocessing",
  ];

  const packages = [
    {
      name: "GOOD",
      description: "Display current logo etc.",
      price: "58.00",
      currency: MonriCurrency.USD,
    },
    {
      name: "BETTER",
      description: "Display current logo etc.",
      price: "98.00",
      currency: MonriCurrency.USD,
    },
    {
      name: "BEST",
      description: "Display current logo etc.",
      price: "149.00",
      currency: MonriCurrency.USD,
    },
  ];

  for (const package_ of packages) {
    await prisma.package.create({ data: package_ });
  }
  console.log("Packages created...");

  for (const category of jobCategories) {
    await prisma.jobCategory.create({ data: category });
  }
  console.log("Categories created...");

  await prisma.skill.createMany({
    data: skillsList.map((skill) => ({ name: skill })),
  });
  console.log("Skills created...");
  // Seed JobPosition
  // const jobPositions = [
  //   {
  //     code: "SWE",
  //     name: "Software Engineer",
  //     description: "Designs, develops, and tests software applications.",
  //   },
  //   {
  //     code: "HWE",
  //     name: "Hardware Engineer",
  //     description: "Designs and tests hardware components.",
  //   },
  //   {
  //     code: "QAE",
  //     name: "Quality Assurance Engineer",
  //     description: "Ensures product quality through testing and validation.",
  //   },
  //   {
  //     code: "MKC",
  //     name: "Marketing Coordinator",
  //     description: "Assists in marketing campaigns and events.",
  //   },
  //   {
  //     code: "SEO",
  //     name: "SEO Specialist",
  //     description: "Optimizes website content for search engines.",
  //   },
  //   {
  //     code: "SR",
  //     name: "Sales Representative",
  //     description: "Sells products and services to customers.",
  //   },
  //   {
  //     code: "AM",
  //     name: "Account Manager",
  //     description: "Manages client accounts and relationships.",
  //   },
  //   {
  //     code: "HRG",
  //     name: "HR Generalist",
  //     description:
  //       "Handles various HR tasks including recruitment and employee relations.",
  //   },
  //   {
  //     code: "REC",
  //     name: "Recruiter",
  //     description: "Sources and hires new employees.",
  //   },
  //   {
  //     code: "FA",
  //     name: "Financial Analyst",
  //     description: "Analyzes financial data and prepares reports.",
  //   },
  //   {
  //     code: "ACC",
  //     name: "Accountant",
  //     description: "Manages accounting records and financial statements.",
  //   },
  //   {
  //     code: "PM",
  //     name: "Product Manager",
  //     description: "Oversees product development and strategy.",
  //   },
  //   {
  //     code: "UXD",
  //     name: "UX Designer",
  //     description: "Designs user experiences for products.",
  //   },
  //   {
  //     code: "DA",
  //     name: "Data Analyst",
  //     description: "Analyzes data to provide insights.",
  //   },
  //   {
  //     code: "CTO",
  //     name: "Chief Technology Officer",
  //     description: "Leads the technology strategy and innovation.",
  //   },
  // ];

  // for (const position of jobPositions) {
  //   await prisma.jobPosition.create({ data: position });
  // }

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
