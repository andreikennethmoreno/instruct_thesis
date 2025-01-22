// app/api/messages/route.ts (GET and POST)
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { messageSchema, MessageData } from '@/lib/schemas';

const prisma = new PrismaClient();

// GET Route to fetch messages
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const senderId = url.searchParams.get('sender_id');
    const receiverId = url.searchParams.get('receiver_id');

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { error: 'Sender ID and Receiver ID are required' },
        { status: 400 }
      );
    }

    // Fetch messages between the sender and receiver, regardless of who sent it
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { sender_id: parseInt(senderId), receiver_id: parseInt(receiverId) },
          { sender_id: parseInt(receiverId), receiver_id: parseInt(senderId) },
        ],
      },
      orderBy: { sent_at: 'desc' }, // Ordering by sent_at in ascending order
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// POST Route to create a new message
export async function POST(request: Request) {
  try {
    const body: MessageData = await request.json();
    console.log("Received body:", body);

    const validatedData = messageSchema.parse(body); // Validate incoming data using Zod schema

    const newMessage = await prisma.message.create({
      data: validatedData,
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
