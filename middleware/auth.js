import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  try {
    const header = req.header("Authorization") || "";
    const token = header.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Token no proporcionado" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-key-2025");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "No autorizado" });
  }
}