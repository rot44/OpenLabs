import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";

// Import Route Handlers
import authRouter from "./routes/auth.routes.js";
import resourceRouter from "./routes/resource.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import auditRouter from "./routes/audit.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";

// Import Error Middleware
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// 1. Response compression
app.use(compression());

// 2. HTTP Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// 3. Request Logger
app.use(morgan("dev"));

// 4. CORS configuration (permits frontend credentials & cross-origin cookies)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  })
);

// 5. Body Parsers with 10MB limit for base64 photo inspection & certificate uploads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 6. Cookie Parser
app.use(cookieParser());

// 7. Health Check Route
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "OpenLabs Backend",
    version: "1.0.0",
  });
});

// 8. Mount Modular API Routes under /api/v1
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/resources", resourceRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/audit", auditRouter);
app.use("/api/v1/analytics", analyticsRouter);

// 9. Centralized Error Handling Middleware (must be after all routes)
app.use(errorHandler);

export default app;
