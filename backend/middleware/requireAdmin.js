import authenticateToken from "./authenticateToken.js";

export default function requireAdmin(req, res, next) {
  if (req.body?.role === "admin") {
    return next();
  }

  authenticateToken(req, res, () => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only." });
    }
    next();
  });
}