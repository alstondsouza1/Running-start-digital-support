import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import autheticateToken from "../middleware/authenticateToken.js";


const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Hardcoded admin username for now (can be stored in .env later)
  const adminUsername = process.env.ADMIN_USERNAME || "admin"; 

  if (username !== adminUsername) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const payload = { role: "admin" };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

  res.json({ message: "Login successful", token });
});


export default router; 