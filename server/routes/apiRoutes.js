const express = require("express");
const Api = require("../models/Api");
const HealthCheck = require("../models/HealthCheck");
const { checkApi } = require("../services/monitorService");

const router = express.Router();

// GET all APIs
router.get("/", async (req, res) => {
  try {
    const apis = await Api.find().sort({ createdAt: -1 });

    res.json(apis);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch APIs",
      error: error.message
    });
  }
});

// GET single API
router.get("/:id", async (req, res) => {
  try {
    const api = await Api.findById(req.params.id);

    if (!api) {
      return res.status(404).json({
        message: "API not found"
      });
    }

    res.json(api);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch API",
      error: error.message
    });
  }
});

// GET health history
router.get("/:id/history", async (req, res) => {
  try {
    const history = await HealthCheck.find({
      api: req.params.id
    })
      .sort({ checkedAt: -1 })
      .limit(50);

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch history",
      error: error.message
    });
  }
});

// ADD API
router.post("/", async (req, res) => {
  try {
    const { name, url, method } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        message: "Name and URL are required"
      });
    }

    const api = await Api.create({
      name,
      url,
      method: method || "GET"
    });

    await checkApi(api);

    const updatedApi = await Api.findById(api._id);

    res.status(201).json(updatedApi);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create API",
      error: error.message
    });
  }
});

// MANUAL HEALTH CHECK
router.post("/:id/check", async (req, res) => {
  try {
    const api = await Api.findById(req.params.id);

    if (!api) {
      return res.status(404).json({
        message: "API not found"
      });
    }

    const result = await checkApi(api);

    const updatedApi = await Api.findById(api._id);

    res.json({
      api: updatedApi,
      result
    });
  } catch (error) {
    res.status(500).json({
      message: "Health check failed",
      error: error.message
    });
  }
});

// DELETE API
router.delete("/:id", async (req, res) => {
  try {
    await Api.findByIdAndDelete(req.params.id);

    await HealthCheck.deleteMany({
      api: req.params.id
    });

    res.json({
      message: "API deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete API",
      error: error.message
    });
  }
});

module.exports = router;