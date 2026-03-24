import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth';
import recipeRoutes from './routes/recipes';
import orderRoutes from './routes/orders';
import uploadRoutes from './routes/upload';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Recipe API is running!' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API endpoints:`);
  console.log(`   - Auth:    http://localhost:${PORT}/api/auth`);
  console.log(`   - Recipes: http://localhost:${PORT}/api/recipes`);
  console.log(`   - Orders:  http://localhost:${PORT}/api/orders`);
  console.log(`   - Upload:  http://localhost:${PORT}/api/upload`);
  console.log(`📁 Uploads:   http://localhost:${PORT}/uploads`);
});
