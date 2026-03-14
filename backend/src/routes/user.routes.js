const express = require("express");
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { validateRequest } = require("../middlewares/validate.middleware");
const userValidator = require("../validators/user.validator");

const router = express.Router();

// Apply authentication to all user routes
router.use(authenticate);

// Get current user's profile
router.get("/profile", userController.getProfile);

// Update current user's profile
router.put(
  "/profile",
  validateRequest(userValidator.updateProfileSchema),
  userController.updateProfile
);

module.exports = router;
