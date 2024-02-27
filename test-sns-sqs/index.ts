import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const testQueueEventsTopic = new aws.sns.Topic("testQueueEventsTopic", {});

const sqsTestQueue = new aws.sqs.Queue("testQueue", {});
export const sqsTestUrl = sqsTestQueue.url;
const testQueueSubscription = new aws.sns.TopicSubscription(
  "testQueueSubscription",
  {
    topic: testQueueEventsTopic.arn,
    protocol: "sqs",
    endpoint: sqsTestQueue.arn,
    rawMessageDelivery: true,
    filterPolicyScope: "MessageBody",
    filterPolicy: JSON.stringify({
      event: ["test-queue"],
    }),
  },
);
