import { z } from 'zod';

export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
});


// Define the Role enum schema
const Role = z.enum(['Admin', 'Educator']); // Zod enum based on your Prisma Role enum

export const userSchema = z.object({
  user_id: z.number().optional(), // This is optional for creating new users, but required for updates
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must be less than 50 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"), // Adjust based on your password policy
  role: Role,
  first_name: z.string().min(1, "First name is required").optional(),
  last_name: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Invalid email address").max(100, "Email must be less than 100 characters"),
  contact_number: z.string().optional(), // Add further validation if necessary
  profile_picture_url: z.string().url("Invalid URL").optional(),
  created_at: z.date().optional(), // Prisma will automatically handle this
  updated_at: z.date().optional(), // Prisma will automatically handle this
});

export type UserData = z.infer<typeof userSchema>;
export type ProductData = z.infer<typeof productSchema>;