// Require the framework and instantiate it

// ESM
import Fastify from "fastify";
import { config } from "dotenv-safe";

config();
const fastify = Fastify({
    logger: true,
});

// Declare a route
fastify.get("/", function(request, reply) {
    reply.send({ hello: "world" });
});

fastify.get("/test-queue", async function(request, reply) {
    return reply.send({ message: "Test queue successful!" });
});

// Run the server!
fastify.listen({ port: 3000 }, function(err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    // Server is now listening on ${address}
});
