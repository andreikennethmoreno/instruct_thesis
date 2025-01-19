import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userSchema, UserData } from '@/lib/schemas';  // Import user schema

const prisma = new PrismaClient();

// GET - Fetch a specific user by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const user = await prisma.user.findUnique({ where: { user_id: parseInt(id) } });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

// PUT - Update a specific user by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body: UserData = await request.json();  // Parse the incoming request body as UserData
    const validatedData = userSchema.parse(body);  // Validate the data using Zod schema

    const updatedUser = await prisma.user.update({
      where: { user_id: parseInt(id) },
      data: validatedData,
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });  // Handle validation errors
    }
    return NextResponse.json({ error: error.message }, { status: 500 });  // Handle other server errors
  }
}

// DELETE - Delete a specific user by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.user.delete({ where: { user_id: parseInt(id) } });
    return new NextResponse(null, { status: 204 });  // No content
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });  // Handle errors during deletion
  }
}
