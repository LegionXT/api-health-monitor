const mongoose = require("mongoose");

const healthCheckSchema = new mongoose.Schema(
  {
    api: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Api",
      required: true
    },

    status: {
      type: String,
      enum: ["UP", "DOWN"],
      required: true
    },

    responseTime: {
      type: Number,
      default: null
    },

    statusCode: {
      type: Number,
      default: null
    },

    checkedAt: {
      type: Date,
      default: Date.now
    }
  }
);

module.exports = mongoose.model("HealthCheck", healthCheckSchema);