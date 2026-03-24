import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { OrderType as Order, Recipe, OrderStatus } from '../types';
import { 
  Package, Clock, CheckCircle, XCircle, Truck, ChefHat, 
  Check, X, RefreshCw, User
} from 'lucide-react';
import { AdminOrderListSkeleton } from '../components/Skeletons';

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

type TabFilter = 'all' | 'pending' | 'active' | 'completed';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [recipes, setRecipes] = useState<Record<string, Recipe>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabFilter>('pending');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [allOrders, allRecipes] = await Promise.all([
      api.getAllOrders(),
      api.getAllRecipes()
    ]);
    
    const recipeMap = allRecipes.reduce((acc, r) => ({ ...acc, [r.id]: r }), {});
    setRecipes(recipeMap);
    setOrders(allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? updated : o));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
    setUpdating(null);
  };

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'pending':
        return orders.filter(o => o.status === 'pending');
      case 'active':
        return orders.filter(o => ['accepted', 'preparing'].includes(o.status));
      case 'completed':
        return orders.filter(o => ['delivered', 'cancelled', 'refused'].includes(o.status));
      default:
        return orders;
    }
  };

  const getActionButtons = (order: Order) => {
    const isUpdating = updating === order.id;
    
    switch (order.status) {
      case 'pending':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChange(order.id, 'accepted')}
              disabled={isUpdating}
              className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Check className="h-4 w-4 mr-1" /> Accept
            </button>
            <button
              onClick={() => handleStatusChange(order.id, 'refused')}
              disabled={isUpdating}
              className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <X className="h-4 w-4 mr-1" /> Refuse
            </button>
          </div>
        );
      case 'accepted':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChange(order.id, 'preparing')}
              disabled={isUpdating}
              className="flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <ChefHat className="h-4 w-4 mr-1" /> Start Preparing
            </button>
            <button
              onClick={() => handleStatusChange(order.id, 'cancelled')}
              disabled={isUpdating}
              className="flex items-center px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </button>
          </div>
        );
      case 'preparing':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChange(order.id, 'delivered')}
              disabled={isUpdating}
              className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Truck className="h-4 w-4 mr-1" /> Mark Delivered
            </button>
            <button
              onClick={() => handleStatusChange(order.id, 'cancelled')}
              disabled={isUpdating}
              className="flex items-center px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </button>
          </div>
        );
      default:
        return (
          <span className="text-sm text-stone-500 italic">No actions available</span>
        );
    }
  };

  const filteredOrders = getFilteredOrders();
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const activeCount = orders.filter(o => ['accepted', 'preparing'].includes(o.status)).length;
  const completedCount = orders.filter(o => ['delivered', 'cancelled', 'refused'].includes(o.status)).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-1 h-10 bg-gray-200 rounded-md animate-pulse" />
          ))}
        </div>
        <AdminOrderListSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
        <button
          onClick={loadData}
          className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'pending'
              ? 'bg-white text-amber-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🔔 Pending ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'active'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          👨‍🍳 In Progress ({activeCount})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'completed'
              ? 'bg-white text-green-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ✅ Completed ({completedCount})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'all'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({orders.length})
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No orders in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status];
            return (
              <div 
                key={order.id} 
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
              >
                {/* Order Header */}
                <div className={`px-6 py-4 border-b ${statusConfig.bgColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order</p>
                        <p className="font-mono text-sm font-bold text-gray-900">#{order.id.slice(-8)}</p>
                      </div>
                      <div className="h-8 w-px bg-gray-200" />
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.user?.username || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{order.user?.email}</p>
                        </div>
                      </div>
                      <div className="h-8 w-px bg-gray-200" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Placed</p>
                        <p className="text-sm text-gray-700">
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
                <div className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      {order.items.map((item, idx) => {
                        const recipe = recipes[item.recipeId];
                        return (
                          <div key={idx} className="flex items-center">
                            {recipe && (
                              <img 
                                src={api.getImageUrl(recipe.imageUrl)} 
                                alt={recipe.title} 
                                className="h-10 w-10 rounded-lg object-cover mr-3 border border-gray-100" 
                              />
                            )}
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">{recipe?.title || 'Unknown'}</span>
                              <span className="text-gray-500"> × {item.quantity}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {recipe ? `$${(recipe.price * item.quantity).toFixed(2)}` : '-'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Order Footer with Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                      <p className="text-lg font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div>
                    {getActionButtons(order)}
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
