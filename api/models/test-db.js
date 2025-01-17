import mongoose from "mongoose";

const MONGO_URL =
  "mongodb+srv://moneytracker123:moneytracker123@cluster1.qnefa.mongodb.net/moneytracker?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connection successful");
    process.exit(0); // Exit after successful connection
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
