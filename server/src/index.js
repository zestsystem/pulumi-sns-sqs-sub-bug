// Require the framework and instantiate it

// ESM
import Fastify from "fastify";
import { config } from "dotenv-safe";
import fp from "fastify-plugin";
import { Consumer } from "sqs-consumer";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

config();
const fastify = Fastify({
    logger: true,
});

// Declare a route
fastify.get("/", function(request, reply) {
    reply.send({ hello: "world" });
});

fastify.register(
    fp(async function(fastify, opts) {
        const consumer = Consumer.create({
            queueUrl: process.env.AWS_SQS_TEST_QUEUE_URL,
            handleMessage: async function(message) {
                if (!message.Body) {
                    throw new Error("No body in message");
                }

                const body = JSON.parse(message.Body);

                fastify.log.info(body);
            },
        });

        consumer.on("error", function(err) {
            fastify.log.error(err.message);
        });

        consumer.on("processing_error", function(err) {
            fastify.log.error(err.message);
        });

        consumer.start();
        fastify.log.info("Test Queue Consumer started!");
    }),
);

fastify.get("/test-queue", async function(request, reply) {
    const snsClient = new SNSClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
    const command = new PublishCommand({
        TopicArn: process.env.AWS_SNS_TEST_TOPIC_ARN,
        Message: JSON.stringify({
            message: "Testing queue!",
            event: "test-queue",
        }),
    });
    await snsClient.send(command);
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
