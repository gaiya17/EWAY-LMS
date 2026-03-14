const userService = require("../services/user.service");

async function getProfile(req, res, next) {
  try {
    const profile = await userService.getProfile(req.user.id);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const updatedProfile = await userService.updateProfile(req.user.id, req.user.role, req.body, {
      ipAddress: req.ip,
      userAgent: req.get("User-Agent")
    });

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile
};
