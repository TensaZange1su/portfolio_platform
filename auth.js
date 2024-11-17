const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const router = express.Router();

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Registration Route
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res, next) => {
    try {
        const { username, password, firstName, lastName, age, gender } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.send("User already exists!");

        const user = new User({
            username,
            password,
            firstName,
            lastName,
            age,
            gender,
        });

        await user.save();

        // Send Welcome Email
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: username, // Assuming username is an email
            subject: "Welcome to Portfolio Platform",
            text: `Hello ${firstName}, welcome to our platform!`,
        });

        res.redirect("/login");
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// Login Route
router.get("/login", (req, res) => {
    res.render("login");
});

router.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) return res.redirect("/login");

            if (user.twoFactorEnabled) {
                req.session.tempUser = user;
                return res.redirect("/verify-2fa");
            }

            req.login(user, (err) => {
                if (err) return next(err);
                res.redirect("/");
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
);

// Logout Route
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/login");
    });
});

// 2FA Setup
router.get("/setup-2fa", (req, res) => {
    const secret = speakeasy.generateSecret();
    req.session.tempSecret = secret.base32;

    QRCode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
        if (err) return res.send("Error generating QR code");
        res.render("setup-2fa", { qrCode: dataUrl });
    });
});

router.post("/setup-2fa", async (req, res, next) => {
    try {
        const { token } = req.body;
        const verified = speakeasy.totp.verify({
            secret: req.session.tempSecret,
            encoding: "base32",
            token,
        });

        if (!verified) return res.send("Invalid 2FA token");

        const user = await User.findById(req.user.id);
        if (!user) return res.redirect("/login");

        user.twoFactorEnabled = true;
        user.twoFactorSecret = req.session.tempSecret;
        await user.save();

        req.session.tempSecret = null;
        res.redirect("/");
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 2FA Verification
router.get("/verify-2fa", (req, res) => {
    res.render("verify-2fa");
});

router.post("/verify-2fa", (req, res, next) => {
    try {
        const { token } = req.body;
        const tempUser = req.session.tempUser;
        if (!tempUser) return res.redirect("/login");

        const verified = speakeasy.totp.verify({
            secret: tempUser.twoFactorSecret,
            encoding: "base32",
            token,
        });

        if (!verified) return res.send("Invalid 2FA token");

        req.login(tempUser, (err) => {
            if (err) return next(err);

            req.session.tempUser = null;
            res.redirect("/");
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
