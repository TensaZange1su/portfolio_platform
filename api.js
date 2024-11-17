const express = require("express");
const axios = require("axios");
const router = express.Router();

// News API Example
router.get("/news", async (req, res) => {
    try {
        const response = await axios.get("https://newsapi.org/v2/top-headlines", {
            params: {
                country: "us",
                apiKey: "YOUR_NEWS_API_KEY", // Replace with your API key
            },
        });
        res.render("news", { articles: response.data.articles });
    } catch (err) {
        console.error(err);
        res.send("Error fetching news.");
    }
});

// Financial API Example
router.get("/stocks", async (req, res) => {
    try {
        const response = await axios.get("https://api.example.com/stocks", {
            params: {
                symbol: "AAPL",
                apiKey: "YOUR_FINANCIAL_API_KEY", // Replace with your API key
            },
        });
        res.render("stocks", { stockData: response.data });
    } catch (err) {
        console.error(err);
        res.send("Error fetching stock data.");
    }
});

module.exports = router;
