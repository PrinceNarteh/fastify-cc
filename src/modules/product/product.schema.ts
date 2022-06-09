import { number, string, z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const productInput = {
  title: z.string(),
  content: z.string(),
  price: z.number(),
};

const productGenerated = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
};

const createProductSchema = z.object({
  ...productInput,
});

const productResponseSchema = z.object({
  ...productInput,
  ...productGenerated,
  owner: z
    .object({
      id: number(),
      name: z.string(),
      email: z.string().optional(),
    })
    .optional(),
});

const productsResponseSchema = z.array(productResponseSchema);

export type CreateProductInput = z.infer<typeof createProductSchema>;
export const { schemas: productSchemas, $ref } = buildJsonSchemas(
  {
    createProductSchema,
    productResponseSchema,
    productsResponseSchema,
  },
  {
    $id: "products",
  }
);
