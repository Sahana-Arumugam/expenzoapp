import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();

// ✅ Connect MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ ROUTES (must match frontend API_URL)
app.use("/api/expenzo/users", userRoutes);
app.use("/api/expenzo/expenses", expenseRoutes);

// ✅ Health check endpoint
app.get("/", (req, res) => {
  res.send("✅ Expenzo backend is running successfully");
});

// ✅ Catch-all for undefined routes (debugging help)
app.use((req, res) => {
  console.log("❌ Invalid route requested:", req.originalUrl);
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));