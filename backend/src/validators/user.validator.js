const { z } = require("zod");

const updateProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  phone: z.string().optional(),
  gender: z.string().optional(),
  birthday: z.string().optional(), // Expected format: YYYY-MM-DD
});

module.exports = {
  updateProfileSchema
};
