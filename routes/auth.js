import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Faltan campos: name, email, password" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "El correo ya está registrado" });

    const user = new User({ email, password, name, role: role || "client" });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "secret-key-2025", { expiresIn: "24h" });

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("ERROR /api/auth/register:", error);
    if (error.code === 11000) return res.status(400).json({ message: "El correo ya está registrado" });
    res.status(500).json({ message: "Error interno al registrar" });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Faltan email o password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "secret-key-2025", { expiresIn: "24h" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("ERROR /api/auth/login:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

export default router;