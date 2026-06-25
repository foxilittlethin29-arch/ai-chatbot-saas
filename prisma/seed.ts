import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash("demo1234", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@example.com",
      password: hashedPassword,
    },
  });

  console.log("✅ Demo user created:");
  console.log("   Email:    demo@example.com");
  console.log("   Password: demo1234");

  // Create a sample conversation
  const conversation = await prisma.conversation.create({
    data: {
      title: "Welcome to AI Chatbot!",
      userId: user.id,
      messages: {
        create: [
          {
            role: "user",
            content: "Hello! What can you help me with?",
            userId: user.id,
          },
          {
            role: "assistant",
            content:
              "Welcome! I'm your AI assistant. I can help you with:\n\n- **Writing** & editing content\n- **Coding** help & debugging\n- **Research** & analysis\n- **Brainstorming** ideas\n- **Answering** questions\n\nWhat would you like to explore today? 🚀",
            userId: user.id,
          },
        ],
      },
    },
  });

  console.log("✅ Sample conversation created!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });