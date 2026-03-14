function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRole = req.user.role.code.toLowerCase();
    
    // Check if the user's role is in the allowedRoles array
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };
}

module.exports = {
  requireRole,
};
