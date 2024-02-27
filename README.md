# pulumi-sns-sqs-sub-bug

Deploy SNS and SQS resources with pulumi

```sh
cd test-sns-sqs && pulumi up
```

Start Server

```sh
cd server && pnpm start
```

Publish a message to SNS topic by hitting the test-queue route.

```sh
curl localhost:3000/test-queue
```

SQS Consumer from Fastify Server does not log sent Message,
Confirming that Subscription between SNS and SQS are not made.

After verifying that SQS consumer is disconnected. Go to AWS SQS dashboard
and manually subscribe to the topic. Test again. Fastify SQS Consumer logs the Message
successfully.

Pulumi fails to establish subscription between SQS and SQS on deploy.
