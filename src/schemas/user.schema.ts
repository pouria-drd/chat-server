import { z } from "zod";

export const loginSchema = z.object({
    identifier: z.string().min(3),
    password: z.string().min(8),
});

export const registerSchema = z.object({
    username: z
        .string()
        .min(3)
        .max(20)
        .regex(/^[a-z][a-z0-9_]{2,19}$/, "Invalid username format"),
    email: z.email("Invalid email format"),
    password: z
        .string()
        .min(8)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            "Password must include uppercase, lowercase, number, and special character"
        ),
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    birthDate: z.date().optional(),
});
