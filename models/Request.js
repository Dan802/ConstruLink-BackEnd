import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  titulo: { type: String, required: true },
  descripcion: String,
  presupuesto: Number,
  status: { type: String, enum: ["open", "assigned", "closed"], default: "open" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Request", requestSchema);