const amqp = require("amqplib");
require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 3002

const app = express();
app.use(express.json());

const RABBITMQ_URI = process.env.RABBITMQ_URI
let channel, connection;

async function consumeMessage() {
    try {
        connection = await amqp.connect(RABBITMQ_URI);
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


app.get("/", (req,res)=>{
    res.status(200).send("User service is up and running")
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
