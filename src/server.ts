import dotenv from 'dotenv';
dotenv.config();
import app from "./app";
import { connectRedis } from './config/redis.config';
import { initializeQdrant } from './config/qdrant.config';
import prisma from './config/database.config';
import {startDocumentCleanupJob} from "./cleanup";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {

        await prisma.$connect();
        console.log('✅ Database connected');


        await connectRedis();
        console.log('✅ Redis connected');

        await initializeQdrant();
        console.log('✅ Qdrant initialized');
        startDocumentCleanupJob();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📝 API Docs  available at http://localhost:${PORT}/docs`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();