import { prisma } from "../../libs/prisma";
import { CreateProductInput } from "./product.schema";

export async function createProduct(
  data: CreateProductInput & { ownerId: number }
) {
  return await prisma.product.create({
    data,
  });
}

export async function getProducts() {
  return await prisma.product.findMany({
    select: {
      title: true,
      content: true,
      price: true,
      id: true,
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteProduct(productId: number, userId: number) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new Error(`Product with ${productId} not found.`);
  }

  if (product.id !== userId) {
    throw new Error("You are not permitted to perform this operation.");
  }

  await prisma.product.delete({ where: { id: productId } });
}
