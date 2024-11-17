const express = require("express");
const PortfolioItem = require("../models/PortfolioItem");

const router = express.Router();

// Middleware for Admin Role Check
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === "admin") {
        return next();
    }
    res.redirect("/login");
}

// Get All Portfolio Items
router.get("/portfolio", async (req, res) => {
    try {
        const items = await PortfolioItem.find().sort({ createdAt: -1 });
        res.render("portfolio", { items });
    } catch (err) {
        console.error(err);
        res.send("Error fetching portfolio items.");
    }
});

// Admin: Add a New Item
router.post("/portfolio", isAdmin, async (req, res) => {
    try {
        const { title, description, images } = req.body; // Images should be URLs for simplicity
        const item = new PortfolioItem({ title, description, images });
        await item.save();
        res.redirect("/portfolio");
    } catch (err) {
        console.error(err);
        res.send("Error creating portfolio item.");
    }
});

// Admin: Edit an Item
router.post("/portfolio/:id/edit", isAdmin, async (req, res) => {
    try {
        const { title, description, images } = req.body;
        await PortfolioItem.findByIdAndUpdate(req.params.id, {
            title,
            description,
            images,
            updatedAt: Date.now(),
        });
        res.redirect("/portfolio");
    } catch (err) {
        console.error(err);
        res.send("Error editing portfolio item.");
    }
});

// Admin: Delete an Item
router.post("/portfolio/:id/delete", isAdmin, async (req, res) => {
    try {
        await PortfolioItem.findByIdAndDelete(req.params.id);
        res.redirect("/portfolio");
    } catch (err) {
        console.error(err);
        res.send("Error deleting portfolio item.");
    }
});

module.exports = router;
