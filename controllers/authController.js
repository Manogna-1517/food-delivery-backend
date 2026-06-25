const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
    console.log("REGISTER API HIT");

    try {
        console.log("BODY RECEIVED:", req.body);

        const { name, email, password } = req.body;

        console.log("NAME:", name);
        console.log("EMAIL:", email);
        console.log("PASSWORD:", password);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        });

    } catch (error) {
        console.log("REGISTER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    console.log("LOGIN API HIT");

    try {
        console.log("LOGIN BODY:", req.body);

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user
        });

    } catch (error) {
        console.log("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};