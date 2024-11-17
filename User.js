const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    age: Number,
    gender: String,
    role: { type: String, default: "editor" }, 
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: String,
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


module.exports = mongoose.model("User", userSchema);
