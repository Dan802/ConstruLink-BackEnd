import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  console.log("🟢 [POST] /api/auth/register — Petición recibida");

  try {
    console.log("🟣 Headers:", req.headers);
    console.log("🟣 Body recibido:", req.body);

    const { email, password, name, role } = req.body;
    console.log("📩 Email:", email);
    console.log("🔒 Password:", password ? "Recibido ✅" : "No recibido ❌");
    console.log("👤 Name:", name);
    console.log("🎭 Role:", role);

    // Validación de campos obligatorios
    if (!email || !password || !name) {
      console.warn("⚠️ Campos faltantes:", { email, password, name });
      return res.status(400).json({ message: "Faltan campos: name, email, password" });
    }

    console.log("🔍 Buscando usuario existente...");
    const existing = await User.findOne({ email });
    console.log("📦 Resultado búsqueda usuario existente:", existing);

    if (existing) {
      console.warn("🚫 El correo ya está registrado:", email);
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    console.log("🧱 Creando nuevo usuario...");
    const user = new User({ email, password, name, role: role || "client" });
    console.log("📄 Usuario antes de guardar:", user);

    await user.save();
    console.log("💾 Usuario guardado correctamente en la base de datos");

    const secret = process.env.JWT_SECRET || "secret-key-2025";
    console.log("🔑 JWT_SECRET detectado:", secret ? "Existe ✅" : "No definido ❌");

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      secret,
      { expiresIn: "24h" }
    );
    console.log("✅ Token generado correctamente:", token ? "Sí" : "No");

    const responsePayload = {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
    console.log("📤 Respuesta final enviada al cliente:", responsePayload);

    res.status(201).json(responsePayload);
  } catch (error) {
    console.error("❌ ERROR en /api/auth/register:", error);

    if (error.code === 11000) {
      console.error("🟥 Error de duplicado (email ya registrado):", error.keyValue);
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    console.error("🟥 Error general del servidor:", error);
    res.status(500).json({ message: "Error interno al registrar" });
  }
});

router.post("/login", async (req, res) => {
  console.log("🔐 Endpoint /login llamado");

  try {
    console.log("📥 BODY recibido:", req.body);
    const { email, password } = req.body;
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);

    // Validación de campos (comentada originalmente)
    // if (!email || !password) {
    //   console.log("⚠️ Faltan email o password");
    //   return res.status(400).json({ message: "Faltan email o password" });
    // }

    const user = await User.findOne({ email });
    console.log("👤 Usuario encontrado:", user);

    if (!user) {
      console.log("❌ Usuario no encontrado con ese email");
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password);
    console.log("🔍 Comparación de contraseñas:", ok);

    if (!ok) {
      console.log("❌ Contraseña incorrecta");
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "secret-key-2025",
      { expiresIn: "24h" }
    );
    console.log("🪙 Token generado:", token);

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    console.log("📦 Datos del usuario para respuesta:", userData);

    res.json({ token, user: userData });
  } catch (error) {
    console.log("🔥 Error en /login:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});


export default router;