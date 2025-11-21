const express = require("express");
const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const router = express.Router();

const ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const API_KEY = process.env.TMDB_KEY;

if (!ACCESS_TOKEN && !API_KEY) {
    console.error("❌ TMDB_ACCESS_TOKEN or TMDB_KEY not found in .env file");
} else if (ACCESS_TOKEN) {
    console.log("✓ Using TMDB Access Token authentication");
} else {
    console.log("✓ Using TMDB API Key authentication");
}

// Create axios instance with proper configuration
const tmdbAPI = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Configure retry logic
axiosRetry(tmdbAPI, {
    retries: 3,
    retryDelay: (retryCount) => {
        return retryCount * 1000; // 1s, 2s, 3s
    },
    retryCondition: (error) => {
        return error.code === 'ECONNRESET' ||
            error.code === 'ETIMEDOUT' ||
            axiosRetry.isNetworkOrIdempotentRequestError(error);
    },
});

// Add request interceptor to add authentication
tmdbAPI.interceptors.request.use((config) => {
    if (ACCESS_TOKEN) {
        config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
    } else if (API_KEY) {
        config.params = {
            ...config.params,
            api_key: API_KEY
        };
    }
    return config;
});

// Helper function to extract safe error
function getError(error) {
    if (error.response && error.response.data) {
        return error.response.data;
    }
    return error.message;
}

// Trending
router.get("/trending", async (req, res) => {
    try {
        const response = await tmdbAPI.get("/trending/movie/week");
        res.json(response.data.results || []);
    } catch (error) {
        console.error("Trending Error:", getError(error));
        res.status(500).json({
            error: getError(error),
            message: "Failed to fetch trending movies"
        });
    }
});

// Popular
router.get("/popular", async (req, res) => {
    try {
        const response = await tmdbAPI.get("/movie/popular");
        res.json(response.data.results || []);
    } catch (error) {
        console.error("Popular Error:", getError(error));
        res.status(500).json({
            error: getError(error),
            message: "Failed to fetch popular movies"
        });
    }
});

// Top Rated
router.get("/top-rated", async (req, res) => {
    try {
        const response = await tmdbAPI.get("/movie/top_rated");
        res.json(response.data.results || []);
    } catch (error) {
        console.error("Top Rated Error:", getError(error));
        res.status(500).json({
            error: getError(error),
            message: "Failed to fetch top rated movies"
        });
    }
});

// Search
router.get("/search/:query", async (req, res) => {
    try {
        const query = req.params.query;
        const response = await tmdbAPI.get("/search/movie", {
            params: {
                query
            },
        });
        res.json(response.data.results);
    } catch (error) {
        console.error("Search Error:", getError(error));
        res.status(500).json({
            error: getError(error)
        });
    }
});

// Category
router.get("/category/:genre", async (req, res) => {
    try {
        const genre = req.params.genre.toLowerCase();

        const genreMap = {
            action: 28,
            comedy: 35,
            horror: 27,
            romance: 10749,
            drama: 18,
            thriller: 53,
            "sci-fi": 878,
        };

        if (!genreMap[genre]) {
            return res.status(400).json({
                error: "Invalid genre"
            });
        }

        const response = await tmdbAPI.get("/discover/movie", {
            params: {
                with_genres: genreMap[genre]
            },
        });

        res.json(response.data.results);
    } catch (error) {
        console.error("Category Error:", getError(error));
        res.status(500).json({
            error: getError(error)
        });
    }
});

module.exports = router;