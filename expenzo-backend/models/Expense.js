import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true, trim: true, default: "Uncategorized" },
    description: { type: String, trim: true, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
