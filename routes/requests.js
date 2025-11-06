import express from "express";
import Request from "../models/Request.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user?.userId };
    const r = new Request(data);
    await r.save();
    res.status(201).json(r);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const list = await Request.find().populate("userId", "name email");
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { id } = req.body;

    const deletedRequest = await Request.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    res
      .status(200)
      .json({ message: "Solicitud eliminada correctamente", deletedRequest });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la solicitud", error });
  }
});

export default router;
