// app/api/products/[id]/route.ts (GET, PUT, DELETE)
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { productSchema, ProductData } from '@/lib/schemas';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body: ProductData = await request.json();
        const validatedData = productSchema.parse(body);

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: validatedData,
        });
        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({error: error.errors}, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await prisma.product.delete({ where: { id: parseInt(id) } });
  return new NextResponse(null, { status: 204 }); // No content
}