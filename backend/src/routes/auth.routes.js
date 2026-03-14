const express = require("express");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many auth requests, please try again later"
  }
});

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/verify-email", authLimiter, authController.verifyEmail);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/verify-reset-code", authLimiter, authController.verifyResetCode);
router.post("/reset-password", authLimiter, authController.resetPassword);
router.get("/me", authenticate, authController.me);

module.exports = router;
