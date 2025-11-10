import express from "express";
import { addExpense, getExpenses, deleteExpense } from "../controllers/expenseController.js";

console.log("✅ expenseRoutes file loaded successfully");

const router = express.Router();

router.post("/", addExpense);
router.get("/", getExpenses);
router.delete("/:id", deleteExpense);

export default router;
