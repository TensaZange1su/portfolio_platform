const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const path = require("path");
const passport = require("./config/passport"); // Custom Passport configuration
const authRoutes = require("./routes/auth");
const portfolioRoutes = require("./routes/portfolio");
const apiRoutes = require("./routes/api");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure necessary environment variables are set
if (!process.env.MONGO_URI || !process.env.SESSION_SECRET) {
    console.error("Missing required environment variables (MONGO_URI or SESSION_SECRET).");
    process.exit(1);
}

// Middleware setup
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Set the view engine
app.set('views', path.join(__dirname, 'views')); // Ensure the path is correct
app.set('view engine', 'ejs'); // Ensure views are loaded from the correct directory

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// Session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1-day session duration
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
    res.render("index", { user: req.user || null }); // Pass the user object to EJS
});

app.use("/auth", authRoutes); // Prefix auth routes with '/auth'
app.use("/portfolio", portfolioRoutes); // Prefix portfolio routes with '/portfolio'
app.use("/api", apiRoutes); // Prefix API routes with '/api'

// Catch-all error handler for unhandled requests
app.use((req, res) => {
    res.status(404).render('404'); // Render the 404.ejs file
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    res.status(500).render('500'); // Render the 500.ejs file
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
