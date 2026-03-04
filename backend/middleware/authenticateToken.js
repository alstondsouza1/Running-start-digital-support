import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const adminUsername = process.env.ADMIN_USERNAME || "admin";

  if (username !== adminUsername) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    return res.status(500).json({ message: "Missing ADMIN_PASSWORD_HASH in server env" });
  }

  const isMatch = await bcrypt.compare(password, hash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Missing JWT_SECRET in server env" });
  }

  const payload = { role: "admin" };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

  res.json({ message: "Login successful", token });
});

export default router;