import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import autheticateToken from "../middleware/authenticateToken.js";


const router = express.Router();

router.post("/login", async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: "Password is required." });
    }

    const isMatch = await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD_HASH,
    );
    
    const payload = { roles: "admin"};

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h"
    });

    res.json({ message: "Login successful", token });
});

router.get("api/check", autheticateToken, (req, res) => {
    res.json({ message: "You are authenticated as Admin.", user: req.user })
});

export default router; 