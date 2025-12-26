
import * as z from "zod";

export const RegisterSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
    email: z.string().email({
        message: "Email is required",
    }),
    phone: z.string().min(10, {
        message: "Phone number is required",
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required",
    }),
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
});

export const ProfileSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    phone: z.string().optional(),
    address: z.string().optional(),
    apartment: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
});
