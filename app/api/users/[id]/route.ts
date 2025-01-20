import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { userSchema, UserData } from '@/lib/schemas';

const prisma = new PrismaClient();

// GET - Fetch a specific user by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const user = await prisma.user.findUnique({ where: { user_id: parseInt(id) } });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Allow access if Admin or the user is fetching their own data
  if (session.user.role === "Admin" || session.user.id === user.user_id) {
    return NextResponse.json(user);
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// PUT - Update a specific user by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const userId = parseInt(id);

  // Check if Admin or Educator updating their own data
  if (session.user.role !== "Admin" && session.user.id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body: UserData = await request.json();
    const validatedData = userSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: validatedData,
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a specific user by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const userId = parseInt(id);

  console.log("delting " + userId )

  // Only Admins can delete users
  if (session.user.role !== "Admin") {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await prisma.user.delete({ where: { user_id: userId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
