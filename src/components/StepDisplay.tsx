import React from 'react';
import type { RecipeStep } from '../types';
import { STEP_ACTIONS } from '../types';
import { Clock, CheckCircle2 } from 'lucide-react';

interface StepDisplayProps {
  steps: RecipeStep[];
  ingredients?: string[];
}

export const StepDisplay: React.FC<StepDisplayProps> = ({ steps, ingredients = [] }) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      {steps.map((step, index) => {
        const actionMeta = STEP_ACTIONS[step.action];
        const isLast = index === steps.length - 1;
        
        return (
          <div 
            key={step.id} 
            className="relative animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Connection line */}
            {!isLast && (
              <div 
                className="absolute left-5 top-12 w-0.5 bg-gradient-to-b from-indigo-300 via-purple-300 to-rose-300 step-connector" 
                style={{ height: 'calc(100% - 1rem)' }} 
              />
            )}
            
            <div className="flex gap-4 group">
              {/* Step number circle with icon */}
              <div className="flex-shrink-0 relative z-10">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${actionMeta.color}`}
                >
                  {actionMeta.icon}
                </div>
                {/* Pulse ring on hover */}
                <div className="absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-20 group-hover:animate-ping" />
              </div>
              
              {/* Step content */}
              <div className="flex-1 pb-6">
                <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-stone-300 group-hover:-translate-y-0.5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs font-bold shadow-sm">
                        {index + 1}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${actionMeta.color}`}>
                        {actionMeta.label}
                      </span>
                    </div>
                    {step.duration && (
                      <div className="flex items-center text-stone-500 text-sm bg-stone-50 px-2 py-1 rounded-full">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span className="font-medium">{step.duration}</span>
                        <span className="text-xs ml-0.5">min</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-stone-700 leading-relaxed">
                    {step.description || <span className="text-stone-400 italic">No description</span>}
                  </p>
                  
                  {/* Ingredients used in this step */}
                  {step.ingredientIndices && step.ingredientIndices.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-100">
                      <p className="text-xs text-stone-400 mb-2 font-medium uppercase tracking-wide">Ingredients:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {step.ingredientIndices.map((idx) => {
                          const ingredient = ingredients[idx];
                          if (!ingredient) return null;
                          return (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border border-rose-200 shadow-sm"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5" />
                              {ingredient}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Completion indicator */}
      <div 
        className="flex gap-4 animate-slide-in"
        style={{ animationDelay: `${steps.length * 100}ms` }}
      >
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex items-center py-2">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-4 py-2 shadow-sm">
            <span className="text-green-700 font-medium flex items-center gap-2">
              <span>Recipe complete!</span>
              <span className="text-lg">🎉</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

