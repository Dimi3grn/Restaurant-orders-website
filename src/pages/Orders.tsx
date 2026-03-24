import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { OrderType as Order, Recipe, OrderStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle, XCircle, Truck, ChefHat } from 'lucide-react';
import { OrderListSkeleton } from '../components/Skeletons';

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  pending: {
    label: 'Pending',
    icon: <Clock className="h-4 w-4" />,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200'
  },
  accepted: {
    label: 'Accepted',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200'
  },
  preparing: {
    label: 'Preparing',
    icon: <ChefHat className="h-4 w-4" />,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200'
  },
  delivered: {
    label: 'Delivered',
    icon: <Truck className="h-4 w-4" />,
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200'
  },
  cancelled: {
    label: 'Cancelled',
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 border-gray-200'
  },
  refused: {
    label: 'Refused',
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200'
  }
};

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [recipes, setRecipes] = useState<Record<string, Recipe>>({});
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      // Should not happen because route is protected, but avoid infinite spinner
      setLoading(false);
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setError(null);
    setLoading(true);
    try {
      const [userOrders, allRecipes] = await Promise.all([
        api.getOrdersByUser(user.id),
        api.getAllRecipes()
      ]);
      
      const recipeMap = allRecipes.reduce((acc, r) => ({ ...acc, [r.id]: r }), {});
      setRecipes(recipeMap);
      setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error('Failed to load orders', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = orders.filter(o => ['pending', 'accepted', 'preparing'].includes(o.status));
  const historyOrders = orders.filter(o => ['delivered', 'cancelled', 'refused'].includes(o.status));

  const displayedOrders = activeTab === 'active' ? activeOrders : historyOrders;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 bg-stone-200 rounded animate-pulse" />
          <div className="flex items-center space-x-1 bg-stone-100 rounded-lg p-1">
            <div className="h-10 w-24 bg-stone-200 rounded-md animate-pulse" />
            <div className="h-10 w-24 bg-stone-200 rounded-md animate-pulse" />
          </div>
        </div>
        <OrderListSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-stone-900">Your Orders</h1>
        <div className="flex items-center space-x-1 bg-stone-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'active'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Active ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            History ({historyOrders.length})
          </button>
        </div>
      </div>

      {displayedOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
          <Package className="h-12 w-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500">
            {activeTab === 'active' 
              ? 'No active orders at the moment.' 
              : 'No order history yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status];
            return (
              <div 
                key={order.id} 
                className={`bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${statusConfig.bgColor}`}
              >
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-stone-100 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wide">Order</p>
                        <p className="font-mono text-sm font-medium text-stone-900">#{order.id.slice(-8)}</p>
                      </div>
                      <div className="hidden sm:block h-8 w-px bg-stone-200" />
                      <div className="hidden sm:block">
                        <p className="text-xs text-stone-500 uppercase tracking-wide">Placed</p>
                        <p className="text-sm text-stone-700">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${statusConfig.bgColor} ${statusConfig.color}`}>
                      {statusConfig.icon}
                      <span className="text-sm font-medium">{statusConfig.label}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4 bg-white">
                  <div className="space-y-3">
                    {order.items.map((item, idx) => {
                      const recipe = recipes[item.recipeId];
                      return (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center">
                            {recipe && (
                              <img 
                                src={api.getImageUrl(recipe.imageUrl)} 
                                alt={recipe.title} 
                                className="h-12 w-12 rounded-lg object-cover mr-4 border border-stone-100" 
                              />
                            )}
                            <div>
                              <p className="font-medium text-stone-900">{recipe?.title || 'Unknown Recipe'}</p>
                              <p className="text-sm text-stone-500">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-stone-900">
                              {recipe ? `$${(recipe.price * item.quantity).toFixed(2)}` : '-'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 bg-stone-50 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-stone-600">
                      {order.status === 'pending' && '⏳ Waiting for restaurant confirmation...'}
                      {order.status === 'accepted' && '✅ Order confirmed! Preparing soon...'}
                      {order.status === 'preparing' && '👨‍🍳 Your order is being prepared!'}
                      {order.status === 'delivered' && '🎉 Order completed! Enjoy your meal!'}
                      {order.status === 'cancelled' && '❌ This order was cancelled.'}
                      {order.status === 'refused' && '😔 Sorry, this order was refused.'}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-stone-500 uppercase tracking-wide">Total</p>
                      <p className="text-lg font-bold text-stone-900">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
