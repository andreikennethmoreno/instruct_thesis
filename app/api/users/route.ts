import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userSchema, UserData } from '@/lib/schemas';  // Import user schema
import bcrypt from 'bcryptjs';


const prisma = new PrismaClient();

// GET - Fetch all users with optional search query
export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchQuery = url.searchParams.get('q')?.toLowerCase(); // Retrieve the 'q' query parameter

  const users = await prisma.user.findMany(); // Fetch all users from the database

  // Filter users if a search query is provided
  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.email.toLowerCase().includes(searchQuery) ||
          user.username.toLowerCase().includes(searchQuery)
      )
    : users;

  return NextResponse.json(filteredUsers);
}


// POST - Create a new user
export async function POST(request: Request) {
  try {
    const body: UserData = await request.json();  // Parse the incoming request body as UserData
    const validatedData = userSchema.parse(body);  // Validate the data using Zod schema

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(validatedData.password, 10); // 10 is the salt rounds
    validatedData.password = hashedPassword;

    // Remove user_id from validatedData
    const { user_id, ...userData } = validatedData;

    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: userData,
    });

    // Redirect to the login page after successful user creation
    return NextResponse.redirect('http://localhost:3000/login', { status: 303 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      // Convert Zod validation errors to a readable string
      const errorMessages = error.errors.map((err: any) => err.message).join(', ');
      return NextResponse.json({ error: errorMessages }, { status: 400 });  // Return error messages as a string
    }
    return NextResponse.json({ error: error.message }, { status: 500 });  // Handle other server errors
  }
}