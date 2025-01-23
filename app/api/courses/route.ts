import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { CourseData, courseSchema } from "@/lib/schemas";


// Updated GET function to filter courses by the owner (logged-in user)
export async function GET(req: Request) {
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('q')?.toLowerCase(); // Retrieve the 'q' query parameter
    const userId = url.searchParams.get('userId'); // Get the user ID from query parameters (you might pass this when calling this endpoint)

    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Fetch courses owned by the user
    const courses = await prisma.course.findMany({
      where: {
        owners: {
          some: {
            user_id: Number(userId), // Ensure the user ID is in the owners array
          },
        },
      },
      include: {
        users: true, // Include enrolled users
        owners: true, // Include course owners
      },
    });

    // Filter courses if a search query is provided
    const filteredCourses = searchQuery
      ? courses.filter(
          (course: { title: string; description: string; course_code: string; }) =>
            course.title.toLowerCase().includes(searchQuery) ||
            course.description?.toLowerCase().includes(searchQuery) ||
            course.course_code.toLowerCase().includes(searchQuery)
        )
      : courses;

    return NextResponse.json(filteredCourses);
}

// POST - Create a new course
export async function POST(request: Request) {
  try {
    const body: CourseData = await request.json(); // Parse the incoming request body
    const validatedData = courseSchema.parse(body); // Validate the data using Zod schema
    console.log(body + "submitting")
    
    // Destructure and ensure owners are parsed as integers
    const { owners, ...courseData } = validatedData;

    if (owners && Array.isArray(owners)) {
      // Ensure all IDs are parsed as integers
      const parsedOwners = owners.map((id: any) => parseInt(id, 10)).filter((id) => !isNaN(id)); // Parse and filter invalid IDs
      if (parsedOwners.length === 0) {
        return NextResponse.json({ error: "Invalid or empty owner IDs provided." }, { status: 400 });
      }

      // Create a new course in the database
      const newCourse = await prisma.course.create({
        data: {
          ...courseData,
          owners: {
            connect: parsedOwners.map((id) => ({ user_id: id })), // Connect owners by IDs
          },
        },
      });

      // Respond with the newly created course
      return NextResponse.json(newCourse, { status: 201 });
    } else {
      return NextResponse.json({ error: "Owners field must be an array of user IDs." }, { status: 400 });
    }
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      // Convert Zod validation errors to a readable string
      const errorMessages = error.errors
        .map((err: any) => `Field "${err.path.join('.')}" ${err.message}`)
        .join('. '); // Format errors to include field path
      return NextResponse.json({ error: errorMessages }, { status: 400 });
    }

    // Handle other types of errors
    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
  }
}
