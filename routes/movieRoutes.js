const express = require("express");
const Movie = require("../models/Movie");

const router = express.Router();

// Get All Movies
router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Add Movie
router.post("/", async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.json(movie);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Delete Movie
router.delete("/:id", async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.json({
            message: "Movie deleted"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;