const { z } = require("zod");

const passwordRule = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number");

const registerSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Valid email is required").transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(10, "Phone number is required"),
  gender: z.string().trim().min(1, "Gender is required"),
  birthday: z.string().min(1, "Birthday is required"),
  password: passwordRule,
  confirmPassword: z.string(),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" })
  })
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"]
    });
  }
});

const loginSchema = z.object({
  email: z.string().email("Valid email is required").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required")
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Valid email is required").transform((value) => value.toLowerCase())
});

const verifyResetCodeSchema = z.object({
  email: z.string().email("Valid email is required").transform((value) => value.toLowerCase()),
  code: z.string().length(6, "Reset code must be 6 digits").regex(/^\d+$/, "Reset code must be numeric")
});

const resetPasswordSchema = z.object({
  email: z.string().email("Valid email is required").transform((value) => value.toLowerCase()),
  code: z.string().length(6, "Reset code must be 6 digits").regex(/^\d+$/, "Reset code must be numeric"),
  password: passwordRule,
  confirmPassword: z.string()
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"]
    });
  }
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required")
});

const verifySetupTokenSchema = z.object({
  email: z.string().email("Valid email is required").transform((value) => value.toLowerCase()),
  token: z.string().min(32, "Invalid setup token")
});

const setupPasswordSchema = z.object({
  email: z.string().email("Valid email is required").transform((value) => value.toLowerCase()),
  token: z.string().min(32, "Invalid setup token"),
  password: passwordRule,
  confirmPassword: z.string()
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"]
    });
  }
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  verifySetupTokenSchema,
  setupPasswordSchema
};
