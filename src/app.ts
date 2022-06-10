import fastifyJwt from "@fastify/jwt";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import productRoutes from "./modules/product/product.route";

import { productSchemas } from "./modules/product/product.schema";
import userRoutes from "./modules/user/user.route";
import swagger from "@fastify/swagger";
import { withRefResolver } from "fastify-zod";
import { userSchemas } from "./modules/user/user.schema";
import { version } from "../package.json";

export const server = Fastify();

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
});

server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      return reply.send(error);
    }
  }
);

server.get("/health-check", async () => {
  return {
    status: "OK",
  };
});

async function main() {
  for (const schema of [...productSchemas, ...userSchemas]) {
    server.addSchema(schema);
  }

  server.register(
    swagger,

    withRefResolver({
      openapi: {
        info: {
          title: "Product API",
          description: "Product API build with fastify",
          version,
        },
      },
      routePrefix: "/doc",
      staticCSP: true,
      exposeRoute: true,
    })
  );

  // Routes
  server.register(userRoutes, { prefix: "api/users" });
  server.register(productRoutes, { prefix: "api/products" });

  try {
    const address = await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`🚀 Server ready at ${address}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

main();
