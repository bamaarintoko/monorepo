import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import userRoutes from '../routes/userRoutes'; // Import user routes
import dotenv from 'dotenv';

const app: Application = express();
dotenv.config();
// Middleware
app.use(cors()); // ✅ Enable CORS for frontend communication
app.use(express.json()); // ✅ Parse JSON request body
app.use(express.urlencoded({ extended: true })); // ✅ Parse URL-encoded data (optional)

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'API is running 🚀' });
});

// API routess
app.use('/', userRoutes); // ✅ Use the userRoutes under /api path


export default app;