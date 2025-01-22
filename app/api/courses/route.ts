import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { CourseData, courseSchema } from "@/lib/schemas";

// GET - Fetch all courses with optional search query
export async function GET(req: Request) {
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('q')?.toLowerCase(); // Retrieve the 'q' query parameter
  
    // Fetch all courses from the database
    const courses = await prisma.course.findMany({
      include: {
        users: true, // Include enrolled users
        owners: true, // Include course owners
      },
    });
  
    // Filter courses if a search query is provided
    const filteredCourses = searchQuery
      ? courses.filter(
          (course) =>
            course.title.toLowerCase().includes(searchQuery) || // Search by title
            course.description?.toLowerCase().includes(searchQuery) || // Search by description
            course.course_code.toLowerCase().includes(searchQuery) // Search by course code
        )
      : courses;
  
    return NextResponse.json(filteredCourses);
  }



// POST - Create a new course
export async function POST(request: Request) {
    try {
      const body: CourseData = await request.json(); // Parse the incoming request body
      const validatedData = courseSchema.parse(body); // Validate the data using Zod schema
  
      const { owner_ids, ...courseData } = validatedData;
  
      // Create a new course in the database
      const newCourse = await prisma.course.create({
        data: {
          ...courseData,
          owners: {
            connect: owner_ids.map((id) => ({ user_id: id })), // Connect owners by IDs
          },
        },
      });
  
      // Respond with the newly created course
      return NextResponse.json(newCourse, { status: 201 });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        // Convert Zod validation errors to a readable string
        const errorMessages = error.errors.map((err: any) => err.message).join(', ');
        return NextResponse.json({ error: errorMessages }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 }); // Handle other server errors
    }
  }
  