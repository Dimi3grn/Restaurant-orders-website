import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Recipe } from '../types';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Clock, ChefHat, ArrowLeft } from 'lucide-react';
import { RecipeDetailsSkeleton } from '../components/Skeletons';
import { StepDisplay } from '../components/StepDisplay';

export const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api.getRecipeById(id).then((data) => {
        setRecipe(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  const handleOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (recipe) {
      try {
        await api.createOrder(user.id, [{ recipeId: recipe.id, quantity: 1 }]);
        navigate('/orders');
      } catch (error) {
        console.error('Failed to order', error);
      }
    }
  };

  if (loading) return <RecipeDetailsSkeleton />;
  if (!recipe) return <div className="text-center py-20">Recipe not found</div>;

  // Check if recipe has visual steps
  const hasVisualSteps = recipe.steps && recipe.steps.length > 0;

  // Calculate total time from steps
  const totalStepTime = hasVisualSteps 
    ? recipe.steps!.reduce((sum, step) => sum + (step.duration || 0), 0)
    : null;

  return (
    <div className="max-w-6xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-stone-500 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Menu
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100">
        {/* Top section with image and basic info */}
        <div className="md:flex">
          {/* Image - fixed height, doesn't stretch */}
          <div className="md:w-2/5 relative h-80 md:h-[450px] flex-shrink-0">
            <img
              src={api.getImageUrl(recipe.imageUrl)}
              alt={recipe.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden" />
          </div>
          
          {/* Basic info - next to image */}
          <div className="p-8 md:w-3/5 bg-white">
            <div>
              <h1 className="text-4xl font-serif font-bold text-stone-900 leading-tight mb-2">{recipe.title}</h1>
              <div className="flex items-center flex-wrap gap-3 mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-rose-100 text-rose-800">
                  {recipe.cuisine}
                </span>
                <div className="flex items-center text-stone-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{recipe.prepTime} mins prep</span>
                </div>
                {hasVisualSteps && (
                  <div className="flex items-center text-stone-500 text-sm">
                    <span>•</span>
                    <span className="ml-2">{recipe.steps!.length} steps</span>
                  </div>
                )}
              </div>
            </div>

            <p className="mt-6 text-stone-600 text-lg leading-relaxed italic border-l-4 border-rose-200 pl-4">
              "{recipe.description}"
            </p>

            {/* Ingredients */}
            <div className="mt-8">
              <h3 className="text-lg font-serif font-bold text-stone-900 mb-3 flex items-center">
                <ChefHat className="h-5 w-5 mr-2 text-rose-500" /> Ingredients
              </h3>
              <ul className="grid grid-cols-2 gap-2">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-center text-stone-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mr-2"></span>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* Order section */}
            <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="block text-sm text-stone-500">Total Price</span>
                <span className="text-3xl font-serif font-bold text-stone-900">${recipe.price.toFixed(2)}</span>
              </div>
              <button
                onClick={handleOrder}
                className="flex items-center px-8 py-4 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Order Now
              </button>
            </div>
          </div>
        </div>

        {/* Recipe Steps - full width below */}
        <div className="border-t border-stone-200">
          <div className="p-8">
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-4 flex items-center">
              {hasVisualSteps ? (
                <>
                  <span className="mr-2">📋</span> 
                  Recipe Steps
                  {totalStepTime && totalStepTime > 0 && (
                    <span className="ml-2 text-sm font-normal text-stone-500">
                      ({totalStepTime} min total)
                    </span>
                  )}
                </>
              ) : (
                'Instructions'
              )}
            </h3>
            
            {hasVisualSteps ? (
              <div className="bg-stone-50 rounded-xl p-6 border border-stone-200">
                <StepDisplay 
                  steps={recipe.steps!} 
                  ingredients={recipe.ingredients}
                />
              </div>
            ) : (
              <div className="text-stone-600 whitespace-pre-line leading-relaxed text-sm bg-stone-50 p-6 rounded-xl">
                {recipe.instructions}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
