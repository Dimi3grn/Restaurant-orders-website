import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { authenticate, generateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, role = 'client' } = req.body;

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'client'
      },
      select: { id: true, email: true, username: true, role: true }
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

// POST /api/auth/logout
router.post('/logout', authenticate, (req: AuthRequest, res: Response) => {
  // With JWT, logout is handled client-side by removing the token
  res.json({ message: 'Logged out successfully' });
});

export default router;

