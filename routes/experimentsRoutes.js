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

router.delete('/:id', async (req, res) => {
    // Here, you would add logic to delete an experiment using req.params.id
    res.json({ message: 'Delete experiment' });
  });

module.exports = router;

