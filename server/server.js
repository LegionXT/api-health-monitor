const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");

const apiRoutes = require("./routes/apiRoutes");
const { checkAllApis } = require("./services/monitorService");

dotenv.config();

const app = express();


// ==============================
// Middleware
// ==============================

app.use(cors());
app.use(express.json());


// ==============================
// Routes
// ==============================

app.use("/api/apis", apiRoutes);


// ==============================
// Server Health
// ==============================

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API Health Monitor server is running"
  });
});


// ==============================
// MongoDB + Server
// ==============================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
// ==============================
// Scheduled API Health Checks
// ==============================

// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("\nRunning scheduled API health checks...");

  try {
    await checkAllApis();
    console.log("Scheduled health checks completed.");
  } catch (error) {
    console.error(
      "Scheduled health check failed:",
      error.message
    );
  }
});