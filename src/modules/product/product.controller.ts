import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../libs/prisma";
import { CreateProductInput } from "./product.schema";

export async function createProductHandler(
  request: FastifyRequest<{
    Body: CreateProductInput;
  }>,
  reply: FastifyReply
) {
  const { body } = request;
  const product = await prisma.product.create({
    data: { ...body, ownerId: request.user.id },
  });
  return reply.code(201).send(product);
}

export async function getProductsHandler() {
  return await prisma.product.findMany();
}
