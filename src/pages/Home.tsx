import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Recipe } from '../types';
import { Search } from 'lucide-react';
import { RecipeGridSkeleton } from '../components/Skeletons';

export const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (searchQuery?: string) => {
    setLoading(true);
    const data = await api.getAllRecipes(searchQuery);
    setRecipes(data);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes(query);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <h1 className="text-4xl font-serif font-bold text-stone-800 tracking-tight text-center">
          Discover World Flavors
        </h1>
        <p className="text-stone-600 max-w-lg text-center px-4">
          Explore our curated collection of exquisite recipes from around the globe.
        </p>
        
        <form onSubmit={handleSearch} className="w-full max-w-xl relative mt-4 px-4">
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-stone-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-white shadow-sm transition-all"
            placeholder="Search for recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-8 top-3.5 h-5 w-5 text-stone-400" />
          <button
            type="submit"
            className="absolute right-6 top-2 px-6 py-1.5 bg-rose-600 text-white rounded-full text-sm font-medium hover:bg-rose-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <RecipeGridSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {recipes.map((recipe) => (
            <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="group block h-full">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-stone-100 h-full flex flex-col will-change-[shadow]">
                <div className="relative pt-[60%] overflow-hidden bg-stone-200">
                    <img
                    src={api.getImageUrl(recipe.imageUrl)}
                    alt={recipe.title}
                    className="absolute top-0 left-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 ease-out will-change-transform"
                    loading="lazy"
                    decoding="async"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-stone-800 uppercase tracking-wide">
                      {recipe.cuisine}
                    </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-serif font-bold text-stone-800 group-hover:text-rose-600 transition-colors duration-150 mb-2">
                    {recipe.title}
                  </h3>
                  <p className="text-stone-600 text-sm line-clamp-3 mb-4 flex-grow">
                    {recipe.description}
                  </p>
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-stone-900">${recipe.price.toFixed(2)}</span>
                    <span className="text-sm font-medium text-rose-600 group-hover:underline">View Recipe &rarr;</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {recipes.length === 0 && (
            <div className="col-span-full text-center py-20 text-stone-500">
                No recipes found matching your taste.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
