import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ ROUTES
app.use("/api/expenzo/users", userRoutes);
app.use("/api/expenzo/expenses", expenseRoutes);

// ✅ ROUTE DEBUG CHECK
console.log("✅ Backend routes loading...");
app._router?.stack?.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`➡️  Route loaded: ${r.route.path}`);
  }
});

// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.send("✅ Expenzo backend is running successfully");
});

// ✅ CATCH INVALID ROUTES (debugging)
app.use((req, res) => {
  console.log("❌ Invalid route requested:", req.originalUrl);
  res.status(404).json({ message: "Route not found" });
});

// ✅ START SERVER
const PORT = process.env.PORT || 5001; // 👈 ensure this matches your port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
