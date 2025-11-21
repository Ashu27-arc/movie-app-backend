const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const movieRoutes = require("./routes/movieRoutes");
const tmdbRoutes = require("./routes/tmdbRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
    .connect("mongodb://127.0.0.1:27017/movieapp")
    .then(() => console.log("MongoDB Connected"))
    .catch((e) => console.log("Error =>", e));

// Routes
app.use("/api/movies", movieRoutes);
app.use("/tmdb", tmdbRoutes);

app.get("/", (req, res) => {
    res.send("Movie API running...");
});

app.listen(5000, () => console.log("Server running on port 5000"));