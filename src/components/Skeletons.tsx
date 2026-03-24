import React from 'react';

// Recipe Card Skeleton (for Home page grid)
export const RecipeCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-stone-100 h-full flex flex-col animate-pulse">
      <div className="relative pt-[60%] bg-stone-200">
        <div className="absolute top-4 right-4 bg-stone-300 h-6 w-16 rounded-full" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="h-6 bg-stone-200 rounded w-3/4 mb-3" />
        <div className="space-y-2 mb-4 flex-grow">
          <div className="h-4 bg-stone-100 rounded w-full" />
          <div className="h-4 bg-stone-100 rounded w-5/6" />
          <div className="h-4 bg-stone-100 rounded w-4/6" />
        </div>
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div className="h-6 bg-stone-200 rounded w-16" />
          <div className="h-4 bg-stone-100 rounded w-24" />
        </div>
      </div>
    </div>
  );
};

export const RecipeGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
};

// Recipe Details Skeleton
export const RecipeDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      <div className="h-6 w-32 bg-stone-200 rounded mb-6" />
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100">
        <div className="md:flex">
          <div className="md:w-1/2 h-96 bg-stone-200" />
          <div className="p-8 md:w-1/2 space-y-6">
            <div className="h-10 bg-stone-200 rounded w-3/4" />
            <div className="flex space-x-4">
              <div className="h-6 w-20 bg-stone-200 rounded-full" />
              <div className="h-6 w-24 bg-stone-100 rounded" />
            </div>
            <div className="space-y-2 border-l-4 border-stone-200 pl-4">
              <div className="h-5 bg-stone-100 rounded w-full" />
              <div className="h-5 bg-stone-100 rounded w-5/6" />
            </div>
            <div>
              <div className="h-6 w-32 bg-stone-200 rounded mb-3" />
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 bg-stone-100 rounded w-24" />
                ))}
              </div>
            </div>
            <div>
              <div className="h-6 w-28 bg-stone-200 rounded mb-3" />
              <div className="h-32 bg-stone-50 rounded-lg" />
            </div>
            <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
              <div className="h-10 w-24 bg-stone-200 rounded" />
              <div className="h-14 w-40 bg-stone-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Card Skeleton
export const OrderCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm animate-pulse">
      {/* Header */}
      <div className="px-6 py-4 border-b border-stone-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <div className="h-3 w-12 bg-stone-200 rounded mb-1" />
              <div className="h-5 w-20 bg-stone-300 rounded" />
            </div>
            <div className="h-8 w-px bg-stone-200" />
            <div>
              <div className="h-3 w-12 bg-stone-200 rounded mb-1" />
              <div className="h-4 w-28 bg-stone-100 rounded" />
            </div>
          </div>
          <div className="h-7 w-24 bg-stone-200 rounded-full" />
        </div>
      </div>
      {/* Items */}
      <div className="px-6 py-4 bg-white space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-stone-200 rounded-lg mr-4" />
              <div>
                <div className="h-4 w-32 bg-stone-200 rounded mb-1" />
                <div className="h-3 w-20 bg-stone-100 rounded" />
              </div>
            </div>
            <div className="h-4 w-16 bg-stone-200 rounded" />
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
        <div className="h-4 w-48 bg-stone-200 rounded" />
        <div>
          <div className="h-3 w-12 bg-stone-200 rounded mb-1" />
          <div className="h-6 w-20 bg-stone-300 rounded" />
        </div>
      </div>
    </div>
  );
};

export const OrderListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
};

// Admin Recipe List Skeleton
export const AdminRecipeRowSkeleton: React.FC = () => {
  return (
    <div className="px-4 py-4 sm:px-6 flex items-center justify-between animate-pulse">
      <div className="flex items-center">
        <div className="h-12 w-12 bg-gray-200 rounded-full" />
        <div className="ml-4">
          <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="h-5 w-5 bg-gray-200 rounded" />
        <div className="h-5 w-5 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export const AdminRecipeListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i}>
            <AdminRecipeRowSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
};

// Admin Order Card Skeleton (with user info)
export const AdminOrderCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-pulse">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <div className="h-3 w-12 bg-gray-200 rounded mb-1" />
              <div className="h-5 w-20 bg-gray-300 rounded" />
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div>
                <div className="h-4 w-28 bg-gray-200 rounded mb-1" />
                <div className="h-3 w-36 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <div className="h-3 w-12 bg-gray-200 rounded mb-1" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="h-7 w-24 bg-gray-200 rounded-full" />
        </div>
      </div>
      {/* Items */}
      <div className="px-6 py-4 space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="h-10 w-10 bg-gray-200 rounded-lg mr-3" />
            <div className="flex-1 h-4 bg-gray-200 rounded w-40" />
            <div className="h-4 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div>
          <div className="h-3 w-10 bg-gray-200 rounded mb-1" />
          <div className="h-6 w-20 bg-gray-300 rounded" />
        </div>
        <div className="flex space-x-2">
          <div className="h-8 w-24 bg-gray-300 rounded-lg" />
          <div className="h-8 w-20 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const AdminOrderListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <AdminOrderCardSkeleton key={i} />
      ))}
    </div>
  );
};

