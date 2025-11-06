import express from "express";
import Professional from "../models/Professional.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const list = await Professional.find().populate("userId", "name email");
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query, especialidad } = req.query;
    const criteria = {};
    if (query) {
      const q = new RegExp(query, "i");
      criteria.$or = [{ nombre: q }, { habilidades: q }, { descripcion: q }];
    }
    if (especialidad) criteria.especialidad = new RegExp(especialidad, "i");

    const results = await Professional.find(criteria).populate("userId", "name email");
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const prof = await Professional.findById(req.params.id).populate("userId", "name email");
    if (!prof) return res.status(404).json({ message: "Profesional no encontrado" });
    res.json(prof);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user.userId };
    const professional = new Professional(data);
    await professional.save();
    const populated = await professional.populate("userId", "name email");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const prof = await Professional.findById(req.params.id);
    if (!prof) return res.status(404).json({ message: "Profesional no encontrado" });
    if (prof.userId.toString() !== req.user.userId) return res.status(403).json({ message: "No autorizado" });
    Object.assign(prof, req.body);
    await prof.save();
    res.json(await prof.populate("userId", "name email"));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const prof = await Professional.findById(req.params.id);
    if (!prof) return res.status(404).json({ message: "Profesional no encontrado" });
    if (prof.userId.toString() !== req.user.userId) return res.status(403).json({ message: "No autorizado" });
    await prof.deleteOne();
    res.json({ message: "Profesional eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;