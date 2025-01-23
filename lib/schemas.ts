import { z } from 'zod';

export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
});


// Define the Role enum schema
const Role = z.enum(['Admin', 'Educator', 'Student']); // Zod enum based on your Prisma Role enum

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

export const messageSchema = z.object({
  message_id: z.number().optional(), // Optional because it's auto-incremented by Prisma
  sender_id: z.number(),
  receiver_id: z.number(),
  message_text: z.string().min(1, "Message text cannot be empty"),
  sent_at: z.date().optional(), // Prisma sets this automatically, but it's optional for validation
  read_at: z.date().nullable().optional(), // Can be null or omitted
});

export const courseSchema = z.object({
  course_id: z.number().optional(), // Optional because it's auto-incremented by Prisma
  course_code: z
    .string()
    .min(1, "Course code is required")
    .max(20, "Course code cannot be longer than 20 characters"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),
  prerequisites: z.string().nullable().optional(), // Can be null or omitted
  learning_outcomes: z.string().nullable().optional(), // Can be null or omitted
  created_at: z.date().optional(), // Prisma sets this automatically
  updated_at: z.date().optional(), // Prisma sets this automatically
  owners: z
    .array(z.number())
    .nonempty("At least one owner is required") // Ensure there's at least one owner
    .min(1, "At least one owner is required"), // Ensures that at least one owner is provided
});


export const topicSchema = z.object({
  topic_id: z.number().optional(), // Optional because it's auto-incremented by Prisma
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  content: z
    .string()
    .nullable()
    .optional(), // Can be null or omitted
  course_id: z.number().min(1, "Course ID is required"), // Ensures the course ID is provided
  creator_id: z.number().nullable().optional(), // Optional: can be null or omitted if no creator
  created_at: z.date().optional(), // Prisma sets this automatically
  updated_at: z.date().optional(), // Prisma sets this automatically
});

export type TopicData = z.infer<typeof topicSchema>;
export type CourseData = z.infer<typeof courseSchema>;
export type MessageData = z.infer<typeof messageSchema>;
export type UserData = z.infer<typeof userSchema>;
export type ProductData = z.infer<typeof productSchema>;