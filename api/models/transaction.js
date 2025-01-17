import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  datetime: Date,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction; 
