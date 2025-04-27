import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

if (process.env.NODE_ENV !== "test") {
    startServer();
} else {
    console.log("🧪 Test environment detected. Server start skipped.");
}
// ----For Testing----
export { app };

const shutdownServer = async (signal) => {
    console.log(`\nReceived ${signal}. Closing server...`);
    server.close(async () => {
        console.log('✅ HTTP server closed.');
        try {
            await mongoose.connection.close();
            console.log('✅ MongoDB connection closed.');
            process.exit(0);
        } catch (err) {
            console.error('❌ Error closing MongoDB connection:', err);
            process.exit(1);
        }
    });

    // Force shutdown
    setTimeout(() => {
        console.error('⚠️ Could not close connections in time, forcing shutdown.');
        process.exit(1);
    }, 10000);
}

process.on('SIGTERM', () => shutdownServer('SIGTERM'));
process.on('SIGINT', () => shutdownServer('SIGINT'));


// --- Unhandled Promise Rejection & Uncaught Exception ---
process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
    shutdownServer('unhandledRejection');
});

process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1); // Or exit immediately as the app state is unknown
});