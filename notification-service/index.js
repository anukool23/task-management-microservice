const amqp = require("amqplib");

let channel, connection;

async function consumeMessage() {
    try {
        connection = await amqp.connect("amqp://rabbitmq:5672");
        channel = await connection.createChannel();
        await channel.assertQueue("task-queue");
        console.log("Notification service is listening to messages");
        channel.consume("task-queue", (msg) => {
            const taskData = JSON.parse(msg.content.toString());
            console.info("Received task:", taskData);
            channel.ack(msg);
        });
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
    }
}

consumeMessage();
