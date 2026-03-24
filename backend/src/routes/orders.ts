import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Valid status transitions
const VALID_STATUSES = ['pending', 'accepted', 'preparing', 'delivered', 'cancelled', 'refused'] as const;

// POST /api/orders - Create order
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body;
    const userId = req.user!.id;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Calculate total amount
    const recipeIds = items.map((item: { recipeId: string }) => item.recipeId);
    const recipes = await prisma.recipe.findMany({
      where: { id: { in: recipeIds } }
    });

    const recipeMap = new Map(recipes.map(r => [r.id, r]));
    
    let totalAmount = 0;
    for (const item of items) {
      const recipe = recipeMap.get(item.recipeId);
      if (!recipe) {
        return res.status(400).json({ error: `Recipe ${item.recipeId} not found` });
      }
      totalAmount += recipe.price * item.quantity;
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'pending',
        items: {
          create: items.map((item: { recipeId: string; quantity: number }) => ({
            recipeId: item.recipeId,
            quantity: item.quantity
          }))
        }
      },
      include: {
        items: true
      }
    });

    // Transform to match frontend expected format
    res.status(201).json({
      id: order.id,
      userId: order.userId,
      items: order.items.map(item => ({
        recipeId: item.recipeId,
        quantity: item.quantity
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt.toISOString()
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders - Get current user's orders
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });

    // Transform to match frontend expected format
    const transformedOrders = orders.map(order => ({
      id: order.id,
      userId: order.userId,
      items: order.items.map(item => ({
        recipeId: item.recipeId,
        quantity: item.quantity
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt.toISOString()
    }));

    res.json(transformedOrders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/all - Get all orders (Admin only)
router.get('/all', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { 
        items: true,
        user: {
          select: { id: true, email: true, username: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform to match frontend expected format
    const transformedOrders = orders.map(order => ({
      id: order.id,
      userId: order.userId,
      user: order.user,
      items: order.items.map(item => ({
        recipeId: item.recipeId,
        quantity: item.quantity
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt.toISOString()
    }));

    res.json(transformedOrders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PATCH /api/orders/:id/status - Update order status (Admin only)
router.patch('/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Valid statuses: ' + VALID_STATUSES.join(', ') 
      });
    }

    // Check if order exists
    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { 
        items: true,
        user: {
          select: { id: true, email: true, username: true }
        }
      }
    });

    res.json({
      id: order.id,
      userId: order.userId,
      user: order.user,
      items: order.items.map(item => ({
        recipeId: item.recipeId,
        quantity: item.quantity
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt.toISOString()
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
