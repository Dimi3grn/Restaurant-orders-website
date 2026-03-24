import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to transform recipe for response
const transformRecipe = (recipe: any) => ({
  ...recipe,
  ingredients: recipe.ingredients as string[],
  steps: recipe.steps as any[] | null
});

// GET /api/recipes - Get all recipes (with optional search & filter)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { query, cuisine } = req.query;

    const where: any = {};

    // Search by title or description
    if (query && typeof query === 'string') {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } }
      ];
    }

    // Filter by cuisine
    if (cuisine && typeof cuisine === 'string') {
      where.cuisine = cuisine;
    }

    const recipes = await prisma.recipe.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(recipes.map(transformRecipe));
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// GET /api/recipes/:id - Get single recipe
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const recipe = await prisma.recipe.findUnique({ where: { id } });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(transformRecipe(recipe));
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// POST /api/recipes - Create recipe (Admin only)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, ingredients, instructions, steps, cuisine, prepTime, price, imageUrl } = req.body;

    // Validation
    if (!title || !description || !ingredients || !cuisine || !prepTime || !price || !imageUrl) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Either instructions OR steps must be provided
    if (!instructions && (!steps || steps.length === 0)) {
      return res.status(400).json({ error: 'Instructions or steps are required' });
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        ingredients,
        instructions: instructions || '', // Can be empty if using steps
        steps: steps || null,             // Store steps as JSON
        cuisine,
        prepTime: Number(prepTime),
        price: Number(price),
        imageUrl
      }
    });

    res.status(201).json(transformRecipe(recipe));
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// PUT /api/recipes/:id - Update recipe (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, ingredients, instructions, steps, cuisine, prepTime, price, imageUrl } = req.body;

    // Check if recipe exists
    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(ingredients && { ingredients }),
        ...(instructions !== undefined && { instructions }),
        ...(steps !== undefined && { steps }),  // Allow null to clear steps
        ...(cuisine && { cuisine }),
        ...(prepTime && { prepTime: Number(prepTime) }),
        ...(price && { price: Number(price) }),
        ...(imageUrl && { imageUrl })
      }
    });

    res.json(transformRecipe(recipe));
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// DELETE /api/recipes/:id - Delete recipe (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if recipe exists
    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    await prisma.recipe.delete({ where: { id } });

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

export default router;
