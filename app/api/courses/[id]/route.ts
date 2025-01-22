import { prisma } from "@/lib/prisma";
import { CourseData, courseSchema } from "@/lib/schemas";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";



// GET - Fetch a specific course by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
  
    // Fetch the course by ID
    const course = await prisma.course.findUnique({
      where: { course_id: parseInt(id) },
      include: {
        users: true, // Include the enrolled users
        owners: true, // Include the course owners
      },
    });
  
    // If course is not found, return a 404 error
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
  
    // Return the course details
    return NextResponse.json(course);
  }




// PUT - Update a specific course by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const { id } = params;
    const courseId = parseInt(id);  // Parse the course ID to integer
  
    // Ensure both session user ID and the course owner's user ID are of the same type (both numbers)
    const sessionUserId = parseInt(session.user.id);
  
    // Fetch the course by ID to check if the user is the owner
    const course = await prisma.course.findUnique({
      where: { course_id: courseId },
      include: { owners: true }, // Include course owners to check ownership
    });
  
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
  
    // Check if the user is the owner of the course or an Admin
    const isOwner = course.owners.some(owner => owner.user_id === sessionUserId);
    if (session.user.role !== "Admin" && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  
    try {
      const body: CourseData = await request.json();
      const validatedData = courseSchema.parse(body); // Validate the incoming data using Zod schema
  
      // Proceed with the update
      const updatedCourse = await prisma.course.update({
        where: { course_id: courseId },
        data: validatedData,
      });
  
      return NextResponse.json(updatedCourse);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  


  // PUT - Update a specific course by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const courseId = parseInt(id);  // Parse the course ID to integer

  // Ensure both session user ID and the course owner's user ID are of the same type (both numbers)
  const sessionUserId = parseInt(session.user.id);

  // Fetch the course by ID to check if the user is the owner
  const course = await prisma.course.findUnique({
    where: { course_id: courseId },
    include: { owners: true }, // Include course owners to check ownership
  });

  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  // Check if the user is the owner of the course or an Admin
  const isOwner = course.owners.some(owner => owner.user_id === sessionUserId);
  if (session.user.role !== "Admin" && !isOwner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body: CourseData = await request.json();
    const validatedData = courseSchema.parse(body); // Validate the incoming data using Zod schema

    // Proceed with the update
    const updatedCourse = await prisma.course.update({
      where: { course_id: courseId },
      data: validatedData,
    });

    return NextResponse.json(updatedCourse);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




// DELETE - Delete a specific course by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const { id } = params;
    const courseId = parseInt(id);
  
    console.log("Deleting course " + courseId);
  
    // Fetch the course by ID to check if the user is the owner
    const course = await prisma.course.findUnique({
      where: { course_id: courseId },
      include: { owners: true }, // Include course owners to check ownership
    });
  
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
  
    // Check if the user is the owner of the course or an Admin
    const sessionUserId = parseInt(session.user.id);
    const isOwner = course.owners.some(owner => owner.user_id === sessionUserId);
  
    if (session.user.role !== "Admin" && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  
    try {
      // Proceed with the deletion
      await prisma.course.delete({ where: { course_id: courseId } });
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
    }
  }
  