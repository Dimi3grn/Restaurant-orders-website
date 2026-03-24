import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

// Helper to generate step IDs
const stepId = () => Math.random().toString(36).substr(2, 9);

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('password', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'Admin User',
      password: adminPassword,
      role: 'admin'
    }
  });
  console.log('✅ Admin user created:', admin.email);

  // Create client user
  const clientPassword = await bcrypt.hash('password', 10);
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      username: 'John Doe',
      password: clientPassword,
      role: 'client'
    }
  });
  console.log('✅ Client user created:', client.email);

  // Create recipes with visual steps
  const recipes = [
    {
      title: 'Spaghetti Carbonara',
      description: 'Classic Roman pasta dish with eggs, cheese, guanciale, and pepper. A creamy, savory delight that embodies the heart of Italian cuisine.',
      ingredients: ['Spaghetti (400g)', 'Eggs (4 large)', 'Pecorino Romano (100g)', 'Guanciale (200g)', 'Black Pepper (freshly ground)'],
      instructions: '1. Boil pasta in salted water\n2. Fry guanciale until crispy\n3. Mix eggs and cheese\n4. Combine all ingredients',
      steps: [
        { id: stepId(), action: 'boil', description: 'Bring a large pot of salted water to boil and cook spaghetti until al dente', duration: 10, ingredientIndices: [0] },
        { id: stepId(), action: 'slice', description: 'Cut guanciale into small cubes or strips', duration: 3, ingredientIndices: [3] },
        { id: stepId(), action: 'fry', description: 'Fry guanciale in a pan over medium heat until crispy and golden', duration: 8, ingredientIndices: [3] },
        { id: stepId(), action: 'mix', description: 'In a bowl, whisk eggs with grated Pecorino Romano and black pepper', duration: 2, ingredientIndices: [1, 2, 4] },
        { id: stepId(), action: 'mix', description: 'Toss hot pasta with guanciale, then quickly mix in egg mixture off heat', duration: 3, ingredientIndices: [0, 1, 2, 3] },
        { id: stepId(), action: 'serve', description: 'Serve immediately with extra Pecorino and black pepper on top', duration: 1, ingredientIndices: [2, 4] },
      ],
      cuisine: 'Italian',
      prepTime: 25,
      price: 12.99,
      imageUrl: 'https://images.unsplash.com/photo-1612874742237-982867143824'
    },
    {
      title: 'Sushi Platter',
      description: 'Assorted fresh sushi rolls and nigiri. A beautiful arrangement of Japanese artistry featuring the freshest fish and perfectly seasoned rice.',
      ingredients: ['Sushi Rice (300g)', 'Nori Sheets (5)', 'Fresh Salmon (200g)', 'Fresh Tuna (200g)', 'Soy Sauce', 'Wasabi', 'Pickled Ginger'],
      instructions: '1. Cook and season rice\n2. Slice fish\n3. Roll sushi\n4. Serve with accompaniments',
      steps: [
        { id: stepId(), action: 'boil', description: 'Rinse and cook sushi rice according to package instructions', duration: 20, ingredientIndices: [0] },
        { id: stepId(), action: 'season', description: 'Season rice with rice vinegar, sugar, and salt while still warm', duration: 5, ingredientIndices: [0] },
        { id: stepId(), action: 'wait', description: 'Let rice cool to room temperature', duration: 15, ingredientIndices: [0] },
        { id: stepId(), action: 'slice', description: 'Slice salmon and tuna into thin, even pieces for nigiri and rolls', duration: 10, ingredientIndices: [2, 3] },
        { id: stepId(), action: 'mix', description: 'Place nori on bamboo mat, spread rice, add fish, and roll tightly', duration: 15, ingredientIndices: [0, 1, 2, 3] },
        { id: stepId(), action: 'slice', description: 'Cut rolls into 6-8 pieces with a wet sharp knife', duration: 5, ingredientIndices: [] },
        { id: stepId(), action: 'serve', description: 'Arrange on platter with soy sauce, wasabi, and pickled ginger', duration: 3, ingredientIndices: [4, 5, 6] },
      ],
      cuisine: 'Japanese',
      prepTime: 45,
      price: 24.50,
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c'
    },
    {
      title: 'Tacos al Pastor',
      description: 'Authentic Mexican street tacos with marinated pork, caramelized pineapple, and fresh cilantro on warm corn tortillas.',
      ingredients: ['Corn Tortillas (12)', 'Pork Shoulder (500g)', 'Pineapple (1 cup, diced)', 'White Onion (1, diced)', 'Fresh Cilantro', 'Lime (2)', 'Achiote Paste'],
      instructions: '1. Marinate pork overnight\n2. Grill pork and pineapple\n3. Warm tortillas\n4. Assemble tacos',
      steps: [
        { id: stepId(), action: 'mix', description: 'Blend achiote paste with spices, orange juice, and vinegar for marinade', duration: 5, ingredientIndices: [6] },
        { id: stepId(), action: 'slice', description: 'Slice pork shoulder into thin strips', duration: 5, ingredientIndices: [1] },
        { id: stepId(), action: 'wait', description: 'Marinate pork for at least 2 hours (overnight is best)', duration: 120, ingredientIndices: [1, 6] },
        { id: stepId(), action: 'grill', description: 'Grill marinated pork over high heat until charred and cooked through', duration: 12, ingredientIndices: [1] },
        { id: stepId(), action: 'grill', description: 'Grill pineapple chunks until caramelized', duration: 5, ingredientIndices: [2] },
        { id: stepId(), action: 'slice', description: 'Dice grilled pork and pineapple into small pieces', duration: 3, ingredientIndices: [1, 2] },
        { id: stepId(), action: 'fry', description: 'Warm tortillas on a dry skillet until pliable', duration: 3, ingredientIndices: [0] },
        { id: stepId(), action: 'serve', description: 'Top tortillas with pork, pineapple, onion, cilantro, and lime juice', duration: 5, ingredientIndices: [0, 1, 2, 3, 4, 5] },
      ],
      cuisine: 'Mexican',
      prepTime: 30,
      price: 3.50,
      imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b'
    },
    {
      title: 'Pad Thai',
      description: 'Thailand\'s most famous noodle dish - stir-fried rice noodles with shrimp, tofu, crunchy peanuts, and tangy lime.',
      ingredients: ['Rice Noodles (250g)', 'Shrimp (200g, peeled)', 'Firm Tofu (150g, cubed)', 'Peanuts (crushed)', 'Bean Sprouts (1 cup)', 'Lime (2)', 'Fish Sauce', 'Tamarind Paste', 'Eggs (2)'],
      instructions: '1. Soak noodles\n2. Make sauce\n3. Stir-fry ingredients\n4. Combine and serve',
      steps: [
        { id: stepId(), action: 'boil', description: 'Soak rice noodles in warm water until softened but still firm', duration: 15, ingredientIndices: [0] },
        { id: stepId(), action: 'mix', description: 'Mix fish sauce, tamarind paste, and sugar to make pad thai sauce', duration: 3, ingredientIndices: [6, 7] },
        { id: stepId(), action: 'fry', description: 'Stir-fry tofu cubes in hot wok until golden brown, set aside', duration: 5, ingredientIndices: [2] },
        { id: stepId(), action: 'fry', description: 'Stir-fry shrimp until pink and cooked, set aside', duration: 4, ingredientIndices: [1] },
        { id: stepId(), action: 'fry', description: 'Scramble eggs in the wok, breaking into small pieces', duration: 2, ingredientIndices: [8] },
        { id: stepId(), action: 'fry', description: 'Add noodles and sauce, toss until noodles absorb the sauce', duration: 4, ingredientIndices: [0, 6, 7] },
        { id: stepId(), action: 'mix', description: 'Add back shrimp, tofu, and half the bean sprouts, toss well', duration: 2, ingredientIndices: [1, 2, 4] },
        { id: stepId(), action: 'serve', description: 'Top with crushed peanuts, remaining sprouts, and lime wedges', duration: 2, ingredientIndices: [3, 4, 5] },
      ],
      cuisine: 'Thai',
      prepTime: 25,
      price: 14.99,
      imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e'
    },
    {
      title: 'Butter Chicken',
      description: 'Creamy, aromatic North Indian curry with tender chicken in a rich tomato and butter sauce. A comfort food classic.',
      ingredients: ['Chicken Thighs (600g)', 'Tomato Puree (400g)', 'Butter (100g)', 'Heavy Cream (200ml)', 'Garam Masala (2 tbsp)', 'Ginger (2 tbsp, minced)', 'Garlic (4 cloves, minced)', 'Kashmiri Chili', 'Yogurt (1 cup)'],
      instructions: '1. Marinate chicken\n2. Grill chicken\n3. Make sauce\n4. Simmer together',
      steps: [
        { id: stepId(), action: 'mix', description: 'Marinate chicken with yogurt, garam masala, ginger, and garlic', duration: 5, ingredientIndices: [0, 4, 5, 6, 8] },
        { id: stepId(), action: 'wait', description: 'Let chicken marinate for at least 30 minutes', duration: 30, ingredientIndices: [0] },
        { id: stepId(), action: 'grill', description: 'Grill or pan-fry chicken until slightly charred', duration: 10, ingredientIndices: [0] },
        { id: stepId(), action: 'fry', description: 'Melt butter in a large pan, sauté ginger and garlic until fragrant', duration: 3, ingredientIndices: [2, 5, 6] },
        { id: stepId(), action: 'mix', description: 'Add tomato puree and Kashmiri chili, simmer for 10 minutes', duration: 10, ingredientIndices: [1, 7] },
        { id: stepId(), action: 'blend', description: 'Blend sauce until smooth (optional but recommended)', duration: 3, ingredientIndices: [1] },
        { id: stepId(), action: 'mix', description: 'Add cream and cooked chicken, simmer for 10 minutes', duration: 10, ingredientIndices: [0, 3] },
        { id: stepId(), action: 'season', description: 'Finish with a knob of butter and adjust seasoning', duration: 2, ingredientIndices: [2, 4] },
        { id: stepId(), action: 'serve', description: 'Serve hot with naan bread or basmati rice', duration: 2, ingredientIndices: [] },
      ],
      cuisine: 'Indian',
      prepTime: 40,
      price: 16.99,
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398'
    },
    {
      title: 'Croissant',
      description: 'Flaky, buttery French pastry with countless delicate layers. A masterpiece of patience and technique.',
      ingredients: ['All-Purpose Flour (500g)', 'Cold Butter (280g)', 'Instant Yeast (7g)', 'Whole Milk (280ml)', 'Sugar (50g)', 'Salt (10g)', 'Egg (for wash)'],
      instructions: '1. Make dough\n2. Laminate with butter\n3. Shape croissants\n4. Proof and bake',
      steps: [
        { id: stepId(), action: 'mix', description: 'Combine flour, yeast, sugar, salt, and warm milk to form dough', duration: 10, ingredientIndices: [0, 2, 3, 4, 5] },
        { id: stepId(), action: 'wait', description: 'Knead dough until smooth, then refrigerate for 1 hour', duration: 60, ingredientIndices: [0] },
        { id: stepId(), action: 'slice', description: 'Pound cold butter into a flat rectangle between parchment paper', duration: 5, ingredientIndices: [1] },
        { id: stepId(), action: 'mix', description: 'Encase butter in dough and perform first fold (letter fold)', duration: 10, ingredientIndices: [0, 1] },
        { id: stepId(), action: 'chill', description: 'Refrigerate for 30 minutes between each fold', duration: 30, ingredientIndices: [] },
        { id: stepId(), action: 'mix', description: 'Repeat folding process 3 more times with resting in between', duration: 120, ingredientIndices: [0, 1] },
        { id: stepId(), action: 'slice', description: 'Roll dough and cut into triangles, then roll into croissant shapes', duration: 20, ingredientIndices: [0] },
        { id: stepId(), action: 'wait', description: 'Let croissants proof in warm place until doubled in size', duration: 90, ingredientIndices: [] },
        { id: stepId(), action: 'bake', description: 'Brush with egg wash and bake at 200°C until golden brown', duration: 18, ingredientIndices: [6] },
        { id: stepId(), action: 'serve', description: 'Cool slightly and serve warm', duration: 5, ingredientIndices: [] },
      ],
      cuisine: 'French',
      prepTime: 180,
      price: 4.50,
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a'
    },
    {
      title: 'Greek Moussaka',
      description: 'Layered Mediterranean casserole with eggplant, spiced meat sauce, and creamy béchamel topping.',
      ingredients: ['Eggplants (3 large)', 'Ground Lamb (500g)', 'Onion (1 large)', 'Tomato Sauce (400g)', 'Cinnamon (1 tsp)', 'Butter (60g)', 'Flour (60g)', 'Milk (500ml)', 'Nutmeg', 'Parmesan (50g)'],
      instructions: '1. Prepare eggplant\n2. Make meat sauce\n3. Make béchamel\n4. Layer and bake',
      steps: [
        { id: stepId(), action: 'slice', description: 'Slice eggplants into 1cm rounds, salt and let drain for 30 mins', duration: 30, ingredientIndices: [0] },
        { id: stepId(), action: 'grill', description: 'Brush eggplant with oil and grill until golden on both sides', duration: 15, ingredientIndices: [0] },
        { id: stepId(), action: 'slice', description: 'Dice onion finely', duration: 3, ingredientIndices: [2] },
        { id: stepId(), action: 'fry', description: 'Brown ground lamb with onion, breaking up the meat', duration: 10, ingredientIndices: [1, 2] },
        { id: stepId(), action: 'mix', description: 'Add tomato sauce and cinnamon, simmer for 15 minutes', duration: 15, ingredientIndices: [3, 4] },
        { id: stepId(), action: 'mix', description: 'Make béchamel: melt butter, whisk in flour, gradually add milk', duration: 10, ingredientIndices: [5, 6, 7] },
        { id: stepId(), action: 'season', description: 'Season béchamel with nutmeg and stir in parmesan', duration: 2, ingredientIndices: [8, 9] },
        { id: stepId(), action: 'mix', description: 'Layer eggplant, meat sauce, repeat, top with béchamel', duration: 10, ingredientIndices: [0, 1, 5] },
        { id: stepId(), action: 'bake', description: 'Bake at 180°C for 45 minutes until golden and bubbling', duration: 45, ingredientIndices: [] },
        { id: stepId(), action: 'wait', description: 'Let rest for 15 minutes before slicing', duration: 15, ingredientIndices: [] },
        { id: stepId(), action: 'serve', description: 'Slice into squares and serve warm', duration: 2, ingredientIndices: [] },
      ],
      cuisine: 'Greek',
      prepTime: 90,
      price: 18.99,
      imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975'
    },
    {
      title: 'Beef Pho',
      description: 'Vietnamese aromatic beef noodle soup with a rich, spiced broth and fresh herbs.',
      ingredients: ['Rice Noodles (400g)', 'Beef Sirloin (300g)', 'Beef Bones (1kg)', 'Star Anise (3)', 'Cinnamon Stick (1)', 'Fish Sauce', 'Bean Sprouts', 'Thai Basil', 'Lime', 'Hoisin Sauce'],
      instructions: '1. Make broth\n2. Prepare toppings\n3. Cook noodles\n4. Assemble and serve',
      steps: [
        { id: stepId(), action: 'boil', description: 'Roast beef bones at 220°C for 30 minutes until browned', duration: 30, ingredientIndices: [2] },
        { id: stepId(), action: 'boil', description: 'Simmer bones with water, star anise, and cinnamon for 3 hours', duration: 180, ingredientIndices: [2, 3, 4] },
        { id: stepId(), action: 'season', description: 'Season broth with fish sauce and strain through fine mesh', duration: 10, ingredientIndices: [5] },
        { id: stepId(), action: 'slice', description: 'Slice beef sirloin paper-thin (freeze slightly for easier slicing)', duration: 10, ingredientIndices: [1] },
        { id: stepId(), action: 'boil', description: 'Cook rice noodles according to package, drain and rinse', duration: 8, ingredientIndices: [0] },
        { id: stepId(), action: 'slice', description: 'Prepare herb plate with basil, sprouts, and lime wedges', duration: 5, ingredientIndices: [6, 7, 8] },
        { id: stepId(), action: 'serve', description: 'Place noodles in bowl, top with raw beef, pour boiling broth over', duration: 3, ingredientIndices: [0, 1] },
        { id: stepId(), action: 'serve', description: 'Serve with herb plate and hoisin sauce on the side', duration: 2, ingredientIndices: [6, 7, 8, 9] },
      ],
      cuisine: 'Vietnamese',
      prepTime: 240,
      price: 15.99,
      imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43'
    }
  ];

  // Clear existing recipes and create new ones
  await prisma.recipe.deleteMany({});
  console.log('🗑️ Cleared existing recipes');

  for (const recipe of recipes) {
    const created = await prisma.recipe.create({
      data: recipe
    });
    console.log('✅ Recipe created:', created.title, `(${recipe.steps?.length || 0} steps)`);
  }

  console.log('🎉 Seeding complete!');
  console.log(`📊 Created ${recipes.length} recipes with visual steps`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
