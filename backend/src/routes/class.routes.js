const express = require("express");
const classController = require("../controllers/class.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

const router = express.Router();

// Approved classes list (Public or Student)
router.get("/approved", classController.getApprovedClasses);
router.get("/my-classes", authenticate, requireRole(["student"]), classController.getMyClasses);

// Auth required for below routes
router.use(authenticate);

// Teacher Routes
router.post("/", requireRole(["teacher"]), classController.createClass);
router.post("/course", requireRole(["teacher"]), classController.createCourse);
router.get("/teacher", requireRole(["teacher"]), classController.getTeacherClasses);
router.post("/:id/resources", requireRole(["teacher"]), classController.addResource);

// Admin Routes
router.get("/pending", requireRole(["admin"]), classController.getPendingClasses);
router.patch("/:id/status", requireRole(["admin"]), classController.approveClass);

// General
router.get("/courses", classController.getCourses);

module.exports = router;
