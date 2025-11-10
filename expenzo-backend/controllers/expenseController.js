import Expense from "../models/Expense.js";

// Create a new expense for the authenticated user
export const addExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (amount == null || isNaN(Number(amount))) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      amount: Number(amount),
      category: category || "Uncategorized",
      description: description || "",
      date: date ? new Date(date) : Date.now(),
    });

    console.log(`Created expense ${expense._id} for user ${req.user._id}`);
    return res.status(201).json(expense);
  } catch (err) {
    console.error("Error adding expense:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// Get expenses for authenticated user
export const getExpenses = async (req, res) => {
  try {
    if (!req.user || !req.user._id) return res.status(401).json({ message: "Not authorized" });
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
    return res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// Delete an expense (owner only)
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (!req.user || expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await expense.deleteOne();
    return res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
