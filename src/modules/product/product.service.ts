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
      id: true,
      title: true,
      content: true,
      price: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}
