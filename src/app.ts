import Fastify from "fastify";

const server = Fastify();

server.get("/health-check", async () => {
  return {
    status: "OK",
  };
});

async function main() {
  try {
    const address = await server.listen(3000, "0.0.0.0");
    console.log(`🚀 Server ready at ${address}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
