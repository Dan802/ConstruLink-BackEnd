import mongoose from "mongoose";

const professionalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nombre: { type: String, required: true },
  especialidad: { type: String, required: true },
  experiencia: String,
  calificacion: { type: Number, default: 4 },
  foto: String,
  habilidades: [String],
  contacto: String,
  precio: { type: Number, required: true },
  descripcion: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Professional", professionalSchema);