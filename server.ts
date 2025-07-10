import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import forumRoutes from './routes/forumRoutes'; 
// Load environment variables from .env
dotenv.config();

// Initialize express app
const app: Application = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('✅ Church App API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/forum', forumRoutes); 


// Create and start HTTP server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Optional: Catch unhandled errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});
