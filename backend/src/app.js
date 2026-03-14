const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { ZodError } = require("zod");
const env = require("./config/env");
const authRoutes = require("./routes/auth.routes");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "EWAY LMS backend is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

app.use((error, req, res, next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      issues: error.flatten()
    });
  }

  return errorHandler(error, req, res, next);
});

module.exports = app;
