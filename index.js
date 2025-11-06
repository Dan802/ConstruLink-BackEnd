import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import professionalRoutes from "./routes/professionals.js";
import requestRoutes from "./routes/requests.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(express.json());

app.use("/ping/", (req,res) => res.send("pong"))
app.use("/api/auth", authRoutes);
app.use("/api/professionals", professionalRoutes);
app.use("/api/requests", requestRoutes);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/manosya")
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error de conexión:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));