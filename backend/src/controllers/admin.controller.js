const adminService = require("../services/admin.service");

async function createUser(req, res, next) {
  try {
    const user = await adminService.createUser(req.body, {
      ipAddress: req.ip,
      userAgent: req.get("User-Agent")
    });

    res.status(201).json({
      message: "User created successfully. A password reset link has been sent to their email.",
      user
    });
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  getUsers
};
