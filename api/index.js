import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import transaction from "./models/transaction.js";
import dotenv from "dotenv";
import Transaction from "./models/transaction.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.get("/api/test", (req, res) => {
  res.json({ body: "test ok" });
});

app.post("/api/transaction", async (req, res) => {
  try {
    const { name, description, datetime, price } = req.body;

    if (!name || !datetime || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTransaction = await transaction.create({
      name,
      description,
      datetime,
      price,
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error saving transaction:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {

    await mongoose.connect(process.env.MONGO_URL);


    const transactions = await transaction.find();


    res.json(transactions);
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Fallback route for undefined endpoints
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server
const port = 4040;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
