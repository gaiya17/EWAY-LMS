const authService = require("../services/auth.service");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  verifySetupTokenSchema,
  setupPasswordSchema
} = require("../validators/auth.validator");

function getRequestMeta(req) {
  return {
    ipAddress: req.ip,
    userAgent: req.get("user-agent")
  };
}

async function register(req, res, next) {
  try {
    const payload = registerSchema.parse(req.body);
    const result = await authService.registerStudent(payload, getRequestMeta(req));
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const payload = loginSchema.parse(req.body);
    const result = await authService.login(payload, getRequestMeta(req));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const payload = forgotPasswordSchema.parse(req.body);
    const result = await authService.sendPasswordResetCode(payload);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function verifyResetCode(req, res, next) {
  try {
    const payload = verifyResetCodeSchema.parse(req.body);
    const result = await authService.verifyResetCode(payload);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const payload = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(payload, getRequestMeta(req));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const payload = verifyEmailSchema.parse(req.body);
    const result = await authService.verifyEmail(payload);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function verifySetupToken(req, res, next) {
  try {
    const payload = verifySetupTokenSchema.parse(req.body);
    const result = await authService.verifySetupToken(payload);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function setupPassword(req, res, next) {
  try {
    const payload = setupPasswordSchema.parse(req.body);
    const result = await authService.setupPassword(payload, getRequestMeta(req));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  me,
  verifyEmail,
  verifySetupToken,
  setupPassword
};
