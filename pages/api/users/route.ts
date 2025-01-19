import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userSchema, UserData } from '@/lib/schemas';  // Import user schema

const prisma = new PrismaClient();

// GET - Fetch all users
export async function GET() {
  const users = await prisma.user.findMany();  // Fetch all users from the database
  return NextResponse.json(users);
}

// POST - Create a new user
export async function POST(request: Request) {
  try {
    const body: UserData = await request.json();  // Parse the incoming request body as UserData
    const validatedData = userSchema.parse(body);  // Validate the data using Zod schema

    const newUser = await prisma.user.create({  // Create a new user in the database
      data: validatedData,
    });

    return NextResponse.json(newUser, { status: 201 });  // Return the newly created user
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });  // Handle validation errors
    }
    return NextResponse.json({ error: error.message }, { status: 500 });  // Handle other server errors
  }
}
