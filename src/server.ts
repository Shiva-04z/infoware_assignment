import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import tenantRoutes from './api/routes/tenant.routes';
import documentRoutes from './api/routes/document.routes';
import queryRoutes from './api/routes/query.routes';
import healthRoutes from './api/routes/health.routes';
import { connectRedis } from './config/redis.config';
import { initializeQdrant } from './config/qdrant.config';
import prisma from './config/database.config';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const swaggerFile = path.join(__dirname, '../documentation/api.yaml');
const swaggerDocument = yaml.load(fs.readFileSync(swaggerFile, 'utf8')) as object;


const app = express();
const PORT = process.env.PORT || 3000;
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', tenantRoutes);
app.use('/api', documentRoutes);
app.use('/api', queryRoutes);
app.use('/', healthRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Maximum size is 10MB.' });
    }

    res.status(500).json({ error: 'Internal server error' });
});


const startServer = async () => {
    try {

        await prisma.$connect();
        console.log('✅ Database connected');


        await connectRedis();
        console.log('✅ Redis connected');

        await initializeQdrant();
        console.log('✅ Qdrant initialized');

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

export default app;