const express = require("express");
const app = express();
const port = 3001;

const experimentsRoutes = require("./path-to-your/experimentsRoutes");
app.use("/experiments", experimentsRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/your-database-name", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Could not connect to MongoDB: ", error));
