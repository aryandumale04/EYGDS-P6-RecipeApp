const User = require("../models/user");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// User Sign-Up Function
const userSignUp = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password cannot be empty" });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists!" });
        }

        const hashPwd = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashPwd });
        await newUser.save();

        const token = jwt.sign(
            { email, id: newUser._id },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        return res.status(201).json({ 
            message: "User registered successfully", 
            token, 
            user: { ...newUser.toObject(), password: undefined } // Remove password from response
        });
    } catch (error) {
        console.error("Sign-Up Error:", error);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
};

// User Login Function
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid Credentials!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid Credentials!" });
        }

        let token = jwt.sign(
            { email, id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ 
            message: "Login successful", 
            token, 
            user: { ...user.toObject(), password: undefined } // Remove password from response
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
};

// Get User Function
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ ...user.toObject(), password: undefined }); // Hide password
    } catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

module.exports = { userLogin, userSignUp, getUser };
