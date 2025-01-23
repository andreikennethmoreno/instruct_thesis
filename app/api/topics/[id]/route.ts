import { prisma } from "@/lib/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

// DELETE - Delete a specific topic by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const { id } = params;
    const topicId = parseInt(id);
  
    console.log("Deleting topic " + topicId);
  
    // Fetch the topic by ID to check if the user is the creator or an Admin
    const topic = await prisma.topic.findUnique({
      where: { topic_id: topicId },
      include: { creator: true }, // Include creator to check if the user is the creator
    });
  
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }
  
    // Check if the user is the creator of the topic or an Admin
    const sessionUserId = parseInt(session.user.id);
    const isCreator = topic.creator?.user_id === sessionUserId;
  
    if (session.user.role !== "Admin" && !isCreator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  
    try {
      // Proceed with the deletion
      await prisma.topic.delete({ where: { topic_id: topicId } });
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete topic' }, { status: 500 });
    }
  }
  