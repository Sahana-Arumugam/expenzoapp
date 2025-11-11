// backend/routes/expenseRoutes.js

import express from "express";
import { addExpense, getExpenses, deleteExpense } from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js"; // <-- IMPORT PROTECT

console.log("✅ expenseRoutes file loaded successfully");

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect); // <-- ADD PROTECT HERE

router.post("/", addExpense);
router.get("/", getExpenses);
router.delete("/:id", deleteExpense);

export default router;