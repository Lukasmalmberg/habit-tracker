const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  // Here, you would add logic to retrieve all experiments from the database
  res.json({ message: "Get all experiments" });
});

router.get("/:id", async (req, res) => {
  // Here, you would add logic to retrieve a single experiment using req.params.id
  res.json({ message: "Get single experiment" });
});

router.post("/", async (req, res) => {
  // Here, you would add logic to create a new experiment using req.body
  res.json({ message: "Create new experiment" });
});

router.put("/:id", async (req, res) => {
  // Here, you would add logic to update an experiment using req.params.id and req.body
  res.json({ message: "Update experiment" });
});

router.delete("/:id", async (req, res) => {
  // Here, you would add logic to delete an experiment using req.params.id
  res.json({ message: "Delete experiment" });
});

router.post("/:id/data", async (req, res) => {
  const experimentId = req.params.id;
  const dataPoint = req.body;

  try {
    const experiment = await Experiment.findById(experimentId);
    if (!experiment) {
      res.status(404).json({ message: "Experiment not found." });
      return;
    }

    experiment.historicalData.push(dataPoint);
    const updatedExperiment = await experiment.save();
    res.status(200).json(updatedExperiment);
  } catch (err) {
    console.error("Error updating experiment:", err);
    res
      .status(500)
      .json({ message: "Error updating experiment in the database." });
  }
});

module.exports = router;
