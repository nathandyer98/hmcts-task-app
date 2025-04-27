import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import taskRoute from "./routes/task.route.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}));

// --- API Routes ---
app.use("/api/tasks", taskRoute);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
    res.status(404).json({ message: "404: Resource not found on this server." });
});


export default app;
