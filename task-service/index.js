const express = require('express');
const { default: mongoose } = require('mongoose');
const amqp = require('amqplib');
require('dotenv').config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3001;
const mongoUrl = process.env.MONGO_URI;

if (!mongoUrl) {
    throw new Error("MONGO_URL is not defined in the environment variables.");
}

mongoose
    .connect(mongoUrl)
    .then(() => {
        console.log("✅ Database connected");
    })
    .catch((err) => {
        console.error("❌ Database connection error:", err);
    });


app.get("/", (req, res) => {
    res.send("Hello from task-service!");
});

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: String,
    createdAt: { type: Date, default: Date.now },
});


const Task = mongoose.model("Task", taskSchema);

let channel, connection;

async function connectToRabbitMQ(retries = 5, delay = 3000){
    while(retries){
        try {
            connection = await amqp.connect("amqp://rabbitmq:5672");
            channel = await connection.createChannel();
            await channel.assertQueue("task-queue");
            console.log("Connected to RabbitMQ");
            return;
        } catch (error) {
            console.error("Error connecting to RabbitMQ:", error);
            retries--;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

app.post("/task",async (req,res)=>{
    const {userId,title,description} = req.body;
    try{
        const task = new Task({userId,title,description});
        await task.save();
        const message = {taskId: task._id.toString(), userId, title};
        if(!channel){
            return res.status(503).json({error:"service unavailable"});
        }
        try {
            channel.sendToQueue ("task-queue", Buffer.from(JSON.stringify(message)));
        } catch (error) {
            console.error("error sending task to queue:", error);
            return res.status(500).json({error:"internal server error"});
            
        }
        res.status(201).json(task);
    }catch(error){
        console.error("error saving task:", error);
        res.status(500).json({error:"internal server error"});
    }
})

app.get("/task", async(req,res)=>{
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error("error fetching tasks:", error);
        res.status(500).json({error:"internal server error"});
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    connectToRabbitMQ();
})