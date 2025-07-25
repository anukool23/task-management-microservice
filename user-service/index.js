const express = require("express");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
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
    res.send("Hello from user-service!");
});

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
});
const User = mongoose.model("User", UserSchema);
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        if (users.length === 0) {
            return res.status(404).json({ error: "no users found" });
        }
        res.status(200).json({ count: users.length, users: users });
    } catch (error) {
        console.error("error saving user:", error);
        res.status(500).json({ error: "internal server error" });
    }
});
app.post("/users", async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = new User({ name, email });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error("error saving user:", error);
        res.status(500).json({ error: "internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
