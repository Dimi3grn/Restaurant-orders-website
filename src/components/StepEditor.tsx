import React, { useState } from 'react';
import type { RecipeStep, StepAction } from '../types';
import { STEP_ACTIONS } from '../types';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, ChevronRight, Package, Sparkles } from 'lucide-react';

interface StepEditorProps {
  steps: RecipeStep[];
  onChange: (steps: RecipeStep[]) => void;
  ingredients?: string[];
}

// Generate unique ID for steps
const generateId = () => Math.random().toString(36).substr(2, 9);

export const StepEditor: React.FC<StepEditorProps> = ({ steps, onChange, ingredients = [] }) => {
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  // Add a new step
  const addStep = (action: StepAction) => {
    const newStep: RecipeStep = {
      id: generateId(),
      action,
      description: '',
      duration: undefined,
      ingredientIndices: [],
    };
    onChange([...steps, newStep]);
    setIsAddingStep(false);
  };

  // Remove a step
  const removeStep = (id: string) => {
    onChange(steps.filter(s => s.id !== id));
  };

  // Update a step's description
  const updateStepDescription = (id: string, description: string) => {
    onChange(steps.map(s => s.id === id ? { ...s, description } : s));
  };

  // Update a step's duration
  const updateStepDuration = (id: string, duration: number | undefined) => {
    onChange(steps.map(s => s.id === id ? { ...s, duration } : s));
  };

  // Toggle ingredient for a step
  const toggleIngredient = (stepId: string, ingredientIndex: number) => {
    onChange(steps.map(s => {
      if (s.id !== stepId) return s;
      const currentIndices = s.ingredientIndices || [];
      const newIndices = currentIndices.includes(ingredientIndex)
        ? currentIndices.filter(i => i !== ingredientIndex)
        : [...currentIndices, ingredientIndex].sort((a, b) => a - b);
      return { ...s, ingredientIndices: newIndices };
    }));
  };

  // Move step up
  const moveStepUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    onChange(newSteps);
  };

  // Move step down
  const moveStepDown = (index: number) => {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    onChange(newSteps);
  };

  // Toggle expanded state for ingredient selection
  const toggleExpanded = (stepId: string) => {
    setExpandedStepId(expandedStepId === stepId ? null : stepId);
  };

  return (
    <div className="space-y-4">
      {/* Steps List */}
      {steps.length > 0 && (
        <div className="space-y-3">
          {steps.map((step, index) => {
            const actionMeta = STEP_ACTIONS[step.action];
            const isExpanded = expandedStepId === step.id;
            const selectedIngredients = step.ingredientIndices || [];
            
            return (
              <div
                key={step.id}
                className="animate-slide-in bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Main step row */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Drag handle & step number */}
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <GripVertical className="h-4 w-4 text-gray-300 cursor-grab active:cursor-grabbing" />
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                        {index + 1}
                      </span>
                    </div>

                    {/* Action badge */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm ${actionMeta.color}`}>
                      <span className="text-base">{actionMeta.icon}</span>
                      <span>{actionMeta.label}</span>
                    </div>

                    {/* Description input */}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={step.description}
                        onChange={(e) => updateStepDescription(step.id, e.target.value)}
                        placeholder={`What to ${step.action}...`}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Duration input */}
                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1">
                      <input
                        type="number"
                        value={step.duration || ''}
                        onChange={(e) => updateStepDuration(step.id, e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="0"
                        className="w-12 px-1 py-1 bg-transparent border-0 text-sm text-center focus:outline-none focus:ring-0"
                      />
                      <span className="text-xs text-gray-500 font-medium">min</span>
                    </div>

                    {/* Move buttons */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveStepUp(index)}
                        disabled={index === 0}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStepDown(index)}
                        disabled={index === steps.length - 1}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeStep(step.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Ingredient toggle button */}
                  {ingredients.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(step.id)}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors group"
                      >
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                        <Package className="h-4 w-4" />
                        <span className="group-hover:underline">
                          {selectedIngredients.length > 0 
                            ? `${selectedIngredients.length} ingredient${selectedIngredients.length > 1 ? 's' : ''} linked`
                            : 'Link ingredients'}
                        </span>
                      </button>
                      
                      {/* Show selected ingredients as pills */}
                      {selectedIngredients.length > 0 && !isExpanded && (
                        <div className="flex flex-wrap gap-1 ml-2 animate-fade-in">
                          {selectedIngredients.slice(0, 3).map((idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200"
                            >
                              {ingredients[idx]}
                            </span>
                          ))}
                          {selectedIngredients.length > 3 && (
                            <span className="text-xs text-gray-400 self-center">
                              +{selectedIngredients.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded ingredient selection */}
                <div className={`transition-all duration-300 ease-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  {ingredients.length > 0 && (
                    <div className="px-4 pb-4 pt-2 bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Select ingredients used in this step:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ingredients.map((ingredient, idx) => {
                          const isSelected = selectedIngredients.includes(idx);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => toggleIngredient(step.id, idx)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                isSelected
                                  ? 'bg-rose-100 text-rose-700 border-2 border-rose-300 shadow-sm scale-105'
                                  : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300 hover:bg-rose-50 hover:scale-105'
                              }`}
                            >
                              {isSelected && <span className="mr-1">✓</span>}
                              {ingredient}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {steps.length === 0 && !isAddingStep && (
        <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-3">👨‍🍳</div>
          <p className="text-gray-600 font-medium mb-1">No steps added yet</p>
          <p className="text-sm text-gray-400">Click the button below to start building your recipe</p>
        </div>
      )}

      {/* Add Step Section */}
      {isAddingStep ? (
        <div className="animate-scale-in bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-semibold text-indigo-700 mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Choose an action:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {(Object.keys(STEP_ACTIONS) as StepAction[]).map((action) => {
              const meta = STEP_ACTIONS[action];
              return (
                <button
                  key={action}
                  type="button"
                  onClick={() => addStep(action)}
                  className={`action-button flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-sm font-medium ${meta.color} border border-transparent hover:border-current`}
                >
                  <span className="text-2xl">{meta.icon}</span>
                  <span className="text-xs">{meta.label}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setIsAddingStep(false)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAddingStep(true)}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-medium">Add Step</span>
        </button>
      )}

      {/* Visual summary */}
      {steps.length > 0 && (
        <div className="flex items-center justify-center py-3 animate-fade-in">
          <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-100">
            <span className="text-sm font-medium text-indigo-700">
              {steps.length} step{steps.length > 1 ? 's' : ''}
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-600">
              {steps.reduce((sum, s) => sum + (s.duration || 0), 0)} min total
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
