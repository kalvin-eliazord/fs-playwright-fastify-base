import Fastify from "fastify";
import { chromium } from "playwright";
import * as dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({ logger: true });

// Simple POST endpoint
fastify.post("/post", async (request, reply) => {
  const { content } = request.body;
  if (!content) return reply.status(400).send({ error: "No content" });

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Placeholder login logic
    // Replace with actual selectors when using a real site
    await page.goto("https://example.com/login");
    await page.fill("input[name='username']", process.env.THREADS_USER);
    await page.fill("input[name='password']", process.env.THREADS_PASS);
    await page.click("button[type='submit']");
    await page.waitForLoadState("networkidle");

    // Placeholder post logic
    console.log("Posting content:", content);

    await browser.close();
    return reply.send({ success: true, message: "Posted (mock)" });
  } catch (err) {
    return reply.status(500).send({ success: false, error: err.message });
  }
});

// Start server
const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 3001,
      host: "0.0.0.0",
    });
    console.log("🚀 Server running!");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
