// app/api/products/route.ts (GET and POST)
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { productSchema, ProductData } from '@/lib/schemas';

const prisma = new PrismaClient();

export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body: ProductData = await request.json();
    const validatedData = productSchema.parse(body);

    const newProduct = await prisma.product.create({
      data: validatedData,
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
        return NextResponse.json({error: error.errors}, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

