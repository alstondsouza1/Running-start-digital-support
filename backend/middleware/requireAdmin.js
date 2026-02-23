import autheticateToken from "./authenticateToken";

export default function requireAdmin(req, res, next) {
    autheticateToken(req, res, function () {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Admins only."})
        }
        next();
    });
}