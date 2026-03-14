const { z } = require("zod");

const createUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["teacher", "staff"], {
    errorMap: () => ({ message: "Role must be 'teacher' or 'staff'" })
  })
});

module.exports = {
  createUserSchema
};

