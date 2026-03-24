export type Role = 'admin' | 'client';

export interface User {
  id: string;
  username: string; // Acts as "Full Name" for display
  email: string;    // Acts as "Username" for login
  password?: string;
  role: Role;
}

// Action types for recipe steps (like Scratch blocks!)
export type StepAction = 
  | 'slice'    // 🔪 Cut/chop ingredients
  | 'mix'      // 🥣 Combine ingredients
  | 'bake'     // 🔥 Oven cooking
  | 'fry'      // 🍳 Pan frying
  | 'boil'     // 💧 Boiling in water
  | 'steam'    // ♨️ Steam cooking
  | 'grill'    // 🥩 Grill/BBQ
  | 'chill'    // 🧊 Refrigerate/freeze
  | 'wait'     // ⏱️ Let rest/wait
  | 'season'   // 🧂 Add spices/seasoning
  | 'blend'    // 🌀 Blend/puree
  | 'serve';   // 🍽️ Final plating

// A single step in the recipe
export interface RecipeStep {
  id: string;
  action: StepAction;
  description: string;
  duration?: number;        // in minutes
  ingredientIndices?: number[]; // indices of ingredients used in this step
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;     // Keep for backwards compatibility
  steps?: RecipeStep[];     // NEW: Structured steps
  cuisine: string;
  prepTime: number;
  price: number;
  imageUrl: string;
}

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'delivered' | 'cancelled' | 'refused';

export interface OrderType {
  id: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    username: string;
  };
  items: {
    recipeId: string;
    quantity: number;
  }[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

// Helper: Action metadata for UI
export const STEP_ACTIONS: Record<StepAction, { label: string; icon: string; color: string }> = {
  slice:  { label: 'Slice/Chop', icon: '🔪', color: 'bg-red-100 text-red-700' },
  mix:    { label: 'Mix',        icon: '🥣', color: 'bg-orange-100 text-orange-700' },
  bake:   { label: 'Bake',       icon: '🔥', color: 'bg-amber-100 text-amber-700' },
  fry:    { label: 'Fry',        icon: '🍳', color: 'bg-yellow-100 text-yellow-700' },
  boil:   { label: 'Boil',       icon: '💧', color: 'bg-blue-100 text-blue-700' },
  steam:  { label: 'Steam',      icon: '♨️', color: 'bg-sky-100 text-sky-700' },
  grill:  { label: 'Grill',      icon: '🥩', color: 'bg-rose-100 text-rose-700' },
  chill:  { label: 'Chill',      icon: '🧊', color: 'bg-cyan-100 text-cyan-700' },
  wait:   { label: 'Wait',       icon: '⏱️', color: 'bg-gray-100 text-gray-700' },
  season: { label: 'Season',     icon: '🧂', color: 'bg-lime-100 text-lime-700' },
  blend:  { label: 'Blend',      icon: '🌀', color: 'bg-purple-100 text-purple-700' },
  serve:  { label: 'Serve',      icon: '🍽️', color: 'bg-green-100 text-green-700' },
};
