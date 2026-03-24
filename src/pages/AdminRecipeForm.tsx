import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Recipe, RecipeStep } from '../types';
import { Upload, X, LinkIcon, FileText, Layers } from 'lucide-react';
import { StepEditor } from '../components/StepEditor';

export const AdminRecipeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<Recipe, 'id'>>({
    title: '',
    description: '',
    ingredients: [],
    instructions: '',
    steps: [],
    cuisine: '',
    prepTime: 0,
    price: 0,
    imageUrl: '',
  });

  const [ingredientsInput, setIngredientsInput] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // NEW: Toggle between text instructions and visual steps
  const [instructionMode, setInstructionMode] = useState<'text' | 'visual'>('text');

  useEffect(() => {
    if (isEditMode && id) {
      api.getRecipeById(id).then((recipe) => {
        if (recipe) {
          setFormData({
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            steps: recipe.steps || [],
            cuisine: recipe.cuisine,
            prepTime: recipe.prepTime,
            price: recipe.price,
            imageUrl: recipe.imageUrl
          });
          setIngredientsInput(recipe.ingredients.join('\n'));
          setImagePreview(api.getImageUrl(recipe.imageUrl));
          setImageMode(recipe.imageUrl.startsWith('http') ? 'url' : 'upload');
          // If recipe has steps, default to visual mode
          if (recipe.steps && recipe.steps.length > 0) {
            setInstructionMode('visual');
          }
        }
      });
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'prepTime' ? parseFloat(value) : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const result = await api.uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: result.imageUrl }));
      setImagePreview(api.getImageUrl(result.imageUrl));
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    setImagePreview(url || null);
  };

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    setImagePreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle steps change from StepEditor
  const handleStepsChange = (steps: RecipeStep[]) => {
    setFormData((prev) => ({ ...prev, steps }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.imageUrl) {
      setUploadError('Please add an image');
      return;
    }

    // Validate instructions based on mode
    if (instructionMode === 'text' && !formData.instructions.trim()) {
      alert('Please add instructions');
      return;
    }
    if (instructionMode === 'visual' && (!formData.steps || formData.steps.length === 0)) {
      alert('Please add at least one step');
      return;
    }

    const recipeData = {
      ...formData,
      ingredients: ingredientsInput.split('\n').filter(i => i.trim() !== ''),
      // If using visual mode, clear text instructions (or auto-generate from steps)
      instructions: instructionMode === 'visual' 
        ? formData.steps?.map((s, i) => `${i + 1}. ${s.description}`).join('\n') || ''
        : formData.instructions,
      // If using text mode, clear steps
      steps: instructionMode === 'visual' ? formData.steps : null,
    };

    try {
      if (isEditMode && id) {
        await api.updateRecipe(id, recipeData);
      } else {
        await api.createRecipe(recipeData);
      }
      navigate('/admin');
    } catch (error) {
      console.error('Failed to save recipe', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Recipe' : 'Create New Recipe'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          />
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Image</label>
          
          <div className="flex space-x-2 mb-3">
            <button
              type="button"
              onClick={() => { setImageMode('upload'); clearImage(); }}
              className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                imageMode === 'upload'
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Upload className="h-4 w-4 mr-1" /> Upload
            </button>
            <button
              type="button"
              onClick={() => { setImageMode('url'); clearImage(); }}
              className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                imageMode === 'url'
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LinkIcon className="h-4 w-4 mr-1" /> URL
            </button>
          </div>

          {imageMode === 'upload' ? (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  uploading ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                    <p className="text-sm text-indigo-600">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload an image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WebP up to 5MB</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleUrlChange}
              placeholder="https://example.com/image.jpg"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            />
          )}

          {uploadError && (
            <p className="mt-2 text-sm text-red-600">{uploadError}</p>
          )}

          {imagePreview && (
            <div className="mt-3 relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                onError={() => setImagePreview(null)}
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Country of Origin</label>
          <input
            type="text"
            name="cuisine"
            required
            placeholder="e.g. Italy, Japan, Mexico"
            value={formData.cuisine}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              name="price"
              step="0.01"
              required
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prep Time (mins)</label>
            <input
              type="number"
              name="prepTime"
              required
              value={formData.prepTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows={3}
            required
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ingredients (one per line)</label>
          <textarea
            rows={5}
            value={ingredientsInput}
            onChange={(e) => setIngredientsInput(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            placeholder="Flour&#10;Sugar&#10;Eggs"
          />
        </div>

        {/* Instructions Section with Mode Toggle */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">Instructions</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setInstructionMode('text')}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  instructionMode === 'text'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FileText className="h-4 w-4 mr-1" /> Text
              </button>
              <button
                type="button"
                onClick={() => setInstructionMode('visual')}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  instructionMode === 'visual'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Layers className="h-4 w-4 mr-1" /> Visual Steps
              </button>
            </div>
          </div>

          {instructionMode === 'text' ? (
            <textarea
              name="instructions"
              rows={5}
              value={formData.instructions}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              placeholder="Write your recipe instructions here..."
            />
          ) : (
            <div className="mt-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <StepEditor
                steps={formData.steps || []}
                onChange={handleStepsChange}
                ingredients={ingredientsInput.split('\n').filter(i => i.trim() !== '')}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditMode ? 'Update Recipe' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};
