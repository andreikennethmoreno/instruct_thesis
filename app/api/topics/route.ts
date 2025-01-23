import { prisma } from "@/lib/prisma";
import { TopicData } from "@/lib/schemas";
import { NextResponse } from "next/server";


// GET - Fetch all topics with optional search query
export async function GET(req: Request) {
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('q')?.toLowerCase(); // Retrieve the 'q' query parameter
    const topics:TopicData = await prisma.topic.findMany({
      include: {
        course: true, // Include related course data
        creator: true, // Include related creator (user) data if available
      },
    }); // Fetch all topics from the database
    
    // Filter topics if a search query is provided
    const filteredTopics = searchQuery
      ? topics.filter(
          (topic) =>
            topic.title.toLowerCase().includes(searchQuery) ||
            (topic.content && topic.content.toLowerCase().includes(searchQuery)) ||
            (topic.course.title && topic.course.title.toLowerCase().includes(searchQuery)) || // Optionally filter by course title
            (topic.creator?.username && topic.creator.username.toLowerCase().includes(searchQuery)) // Optionally filter by creator's username
        )
      : topics;
  
    return NextResponse.json(filteredTopics);
  }
  


// POST - Create a new topic
export async function POST(req: Request) {
    try {
      // Parse the incoming request body as JSON
      let body: TopicData;
      try {
        body = await req.json();
      } catch (parseError) {
        console.error("Invalid JSON in request body:", parseError);
        return NextResponse.json(
          { error: "Invalid JSON format in request body." },
          { status: 400 }
        );
      }
  
      console.log("Incoming request body:", body);
  
      // Destructure the body to extract topic details
      const { title, content, course_id, creator_id } = body;
  
      // Validate that the body contains required fields and is in the correct format
      if (typeof title !== "string" || title.trim() === "") {
        return NextResponse.json(
          { error: "Title is required and must be a non-empty string." },
          { status: 400 }
        );
      }
  
      if (typeof course_id !== "string" || course_id.trim() === "") {
        return NextResponse.json(
          { error: "course_id is required and must be a non-empty string." },
          { status: 400 }
        );
      }
  
      if (content && typeof content !== "string") {
        return NextResponse.json(
          { error: "Content must be a string if provided." },
          { status: 400 }
        );
      }
  
      if (creator_id && typeof creator_id !== "string") {
        return NextResponse.json(
          { error: "creator_id must be a string if provided." },
          { status: 400 }
        );
      }
  
      // Create a new topic in the database
      const newTopic = await prisma.topic.create({
        data: {
          title: title.trim(),
          content: content?.trim() || null,
          course_id: course_id.trim(),
          creator_id: creator_id?.trim() || null, // Optional: Can be null if no creator is specified
        },
      });
  
      // Return the newly created topic as the response
      return NextResponse.json(newTopic, { status: 201 });
    } catch (error) {
      // Handle specific Prisma errors if needed
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma error:", error);
        return NextResponse.json(
          { error: "Database error occurred. Please check your data and try again." },
          { status: 500 }
        );
      }
  
      console.error("Error creating topic:", error);
      return NextResponse.json(
        { error: "Failed to create topic. Please try again." },
        { status: 500 }
      );
    }
  }
  
  