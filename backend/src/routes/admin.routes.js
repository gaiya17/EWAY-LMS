const express = require("express");
const adminController = require("../controllers/admin.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const { validateRequest } = require("../middlewares/validate.middleware");
const adminValidator = require("../validators/admin.validator");

const router = express.Router();

// Apply authentication to all admin routes
router.use(authenticate);
// Apply role check for ADMIN
router.use(requireRole(["admin"]));

// List Users
router.get("/users", adminController.getUsers);

// Create User (Teacher or Staff)
router.post(
  "/users",
  validateRequest(adminValidator.createUserSchema),
  adminController.createUser
);

module.exports = router;
