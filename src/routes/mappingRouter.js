const express = require("express");
const mappingStore = require("../utils/mappingStore");

const mappingRouter = express.Router();

mappingRouter.get("/", (req, res) => {
  res.json({
    success: true,
    mappings: mappingStore.get(),
    mappingDone: mappingStore.isReady(),
  });
});

mappingRouter.post("/", (req, res) => {
  const { mappings } = req.body;

  if (!Array.isArray(mappings)) {
    return res.status(400).json({
      success: false,
      message: "Mappings must be an array.",
    });
  }

  for (const mapping of mappings) {
    if (!mapping.service || !mapping.repository) {
      return res.status(400).json({
        success: false,
        message: "Each mapping must contain service and repository.",
      });
    }
  }

  mappingStore.save(mappings);

  res.json({
    success: true,
    message: "Mappings saved successfully.",
    mappingDone: true,
  });
});

module.exports = mappingRouter;