const mongoose = require("mongoose");

const apiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    url: {
      type: String,
      required: true,
      trim: true
    },

    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "DELETE"],
      default: "GET"
    },

    status: {
      type: String,
      enum: ["UP", "DOWN", "UNKNOWN"],
      default: "UNKNOWN"
    },

    responseTime: {
      type: Number,
      default: null
    },

    uptime: {
      type: Number,
      default: 100
    },

    lastChecked: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Api", apiSchema);