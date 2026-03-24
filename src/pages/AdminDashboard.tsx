import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Recipe } from '../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { AdminRecipeListSkeleton } from '../components/Skeletons';

export const AdminDashboard: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    setLoading(true);
    const data = await api.getAllRecipes();
    setRecipes(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await api.deleteRecipe(id);
      loadRecipes();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Recipes</h1>
        <Link
          to="/admin/recipes/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Recipe
        </Link>
      </div>

      {loading ? (
        <AdminRecipeListSkeleton count={5} />
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={api.getImageUrl(recipe.imageUrl)}
                      alt={recipe.title}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-indigo-600 truncate">{recipe.title}</div>
                      <div className="text-sm text-gray-500">{recipe.cuisine}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link
                      to={`/admin/recipes/${recipe.id}/edit`}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
             {recipes.length === 0 && (
                <li className="px-4 py-8 text-center text-gray-500">No recipes found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
