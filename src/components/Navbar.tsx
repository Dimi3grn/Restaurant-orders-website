import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, UtensilsCrossed, ClipboardList, Settings } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="bg-rose-100 p-2 rounded-full group-hover:bg-rose-200 transition-colors">
                <UtensilsCrossed className="h-6 w-6 text-rose-600" />
              </div>
              <span className="ml-3 text-2xl font-serif font-bold text-stone-800 tracking-tight">
                The Menu<span className="text-rose-600">.</span>
              </span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-stone-500 hover:text-stone-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Menu
              </Link>
              {user && (
                 <Link
                 to="/orders"
                 className="border-transparent text-stone-500 hover:text-stone-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
               >
                 My Orders
               </Link>
              )}
              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin/orders"
                    className="border-transparent text-stone-500 hover:text-stone-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                  >
                    <ClipboardList className="h-4 w-4 mr-1" />
                    Manage Orders
                  </Link>
                  <Link
                    to="/admin"
                    className="border-transparent text-rose-600 hover:text-rose-800 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Recipes
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-6">
                <span className="text-sm font-medium text-stone-600 hidden md:block">
                  Bon appétit, <span className="text-stone-900">{user.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition-all focus:outline-none"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-stone-600 hover:text-stone-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-stone-900 text-white hover:bg-stone-800 px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
