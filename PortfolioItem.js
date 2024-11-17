const mongoose = require("mongoose");

const portfolioItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [String], // Array of image URLs
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

module.exports = mongoose.model("PortfolioItem", portfolioItemSchema);
