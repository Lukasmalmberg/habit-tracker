const mongoose = require("mongoose");

// Defining the DataPoint Schema
const DataPointSchema = new mongoose.Schema({
  date: String, // Or you can use Date type if you want to store it as a date object
  value: Number,
  experimentId: Number,
});

// Defining the Experiment Schema
const ExperimentSchema = new mongoose.Schema({
  name: String,
  historicalData: [DataPointSchema], // Array of DataPoint documents
});

// Creating the Model from the Schema
const Experiment = mongoose.model("Experiment", ExperimentSchema);

// Exporting the Model
module.exports = Experiment;
