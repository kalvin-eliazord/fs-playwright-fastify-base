import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";

dotenv.config();

const app = Fastify({ logger: true });

// -------------------------
// CORS - allow frontend to call backend
// -------------------------
app.register(cors, {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow curl/Postman
    if (
      process.env.NODE_ENV !== "production" &&
      ["http://localhost:3000", "http://127.0.0.1:3000"].includes(origin)
    ) {
      return cb(null, true);
    }
    if (origin === process.env.FRONTEND_URL) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-api-key"],
  credentials: true,
});

// -------------------------
// Lightweight API key auth
// -------------------------
app.addHook("preHandler", (request, reply, done) => {
  if (process.env.NODE_ENV === "production") {
    const apiKey = request.headers["x-api-key"];
    if (!apiKey || apiKey !== process.env.MY_API_KEY) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
  }
  done();
});

// -------------------------
// Health check endpoint
// -------------------------
app.get("/health", async () => ({ status: "ok" }));

// -------------------------
// Bot trigger endpoint
// -------------------------
app.get("/start-bot", async (req, reply) => {
  try {
    import("./bots/patchrightBot.js").then((module) => module.startBot());
    return { message: "Bot started" };
  } catch (err) {
    app.log.error(err);
    return reply.code(500).send({ error: "Failed to start bot" });
  }
});

// -------------------------
// Start server (production-ready for Railway)
// -------------------------
const PORT = process.env.PORT || 4000;
app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
