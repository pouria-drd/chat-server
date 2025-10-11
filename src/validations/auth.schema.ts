import { z } from "zod";

export const loginSchema = z.object({
    identifier: z.string().min(1, "Username/email is required"),

    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
    email: z.email("Invalid email format"),
    username: z
        .string()
        .min(3, "Username must be between 3 and 20 characters")
        .max(20, "Username must be between 3 and 20 characters")
        .regex(
            /^[a-z][a-z0-9_]{2,19}$/,
            "Username can only contain lowercase letters, numbers and underscores"
        ),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must include uppercase character")
        .regex(/[a-z]/, "Password must include lowercase character")
        .regex(/[0-9]/, "Password must include number"),
    firstName: z
        .string("First name is required")
        .min(2, "First name must be between 2 and 50 characters")
        .max(50, "First name must be between 2 and 50 characters"),

    lastName: z
        .string()
        .min(2, "Last name must be between 2 and 50 characters")
        .max(50, "Last name must be between 2 and 50 characters")
        .optional(),

    gender: z.enum(["male", "female", "other"]).optional(),

    birthDate: z
        .union([z.date(), z.string().transform((val) => (val ? new Date(val) : undefined))])
        .optional()
        .refine(
            (date) => {
                if (!date) return true;
                const year1900 = new Date("1900-01-01");
                const now = new Date();
                return date >= year1900 && date <= now;
            },
            { message: "Birth date must be between 1900 and today" }
        ),
});
