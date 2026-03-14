const validateRequest = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Validation Error",
      errors: error.errors?.map((e) => ({
        path: e.path.join('.'),
        message: e.message
      })) || error.message
    });
  }
};

module.exports = {
  validateRequest,
};
