import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/connectdb";
import userRouter from "./routes/user/user.route";
import productRouter from "./routes/product/product-route";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { createRateLimiter } from "./middlewares/rate-limiter";

dotenv.config({ path: "./.env" });

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const rateLimiter = createRateLimiter({
    capacity : 10,
    refillRate : 1,
    cleanUpInterval : 60 * 1000,
    staleMultiplier : 2,
    maxBuckets : 1000,
  });

// WebSocket connection handler
wss.on("connection", function connection(ws) {
  console.log("🔌 Client connected");

  ws.on("error", console.error);

  ws.on("message", function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  ws.send("👋 Hello! Message from server");
});

// Database connection
connectDB()
  .then(() => {
    const port = process.env.PORT || 8001;
    server.listen(port, () => {
      console.log("🚀 Server is listening at", port);
    });
  })
  .catch(console.error);

// Middleware
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://api.baburam-sarki.com.np", 
//       "https://baburam-sarki.com.np"
//     ],
//     credentials: true,
//   })
// );
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(rateLimiter);

// Routes
app.get("/", (req, res) => {
  return  res.json({message : "i am from node js in contianer"});
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);