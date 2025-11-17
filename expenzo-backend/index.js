import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();

// ✅ Connect MongoDB once during cold start
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/expenzo/users", userRoutes);
app.use("/api/expenzo/expenses", expenseRoutes);

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.send("✅ Expenzo backend is running successfully (Vercel)");
});

// ❌ REMOVE THIS (NOT ALLOWED IN VERCEL):
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));

// ✅ EXPORT APP FOR VERCEL SERVERLESS FUNCTIONS
export default app;
