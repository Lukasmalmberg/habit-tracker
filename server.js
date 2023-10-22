const express = require("express");
const app = express();
const port = 3001;

const experimentsRoutes = require("./routes/experimentsRoutes");

app.use("/api/experiments", experimentsRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://lukasmalmberg12:kcTNfq81sPt6WufZ@experimentapp.7anr9hi.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Could not connect to MongoDB: ", error));
