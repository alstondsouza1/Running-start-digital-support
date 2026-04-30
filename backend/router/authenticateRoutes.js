import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminUsername || !hash || !jwtSecret) {
    return res.status(500).json({
      message:
        "Server authentication configuration is incomplete. Missing ADMIN_USERNAME, ADMIN_PASSWORD_HASH, or JWT_SECRET.",
    });
  }

  if (username.trim() !== adminUsername.trim()) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const isMatch = await bcrypt.compare(password, hash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const payload = {
    role: "admin",
    username: adminUsername,
  };

  const token = jwt.sign(payload, jwtSecret, { expiresIn: "2h" });

  return res.json({ message: "Login successful", token });
});

export default router;