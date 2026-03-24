import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UtensilsCrossed } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await api.login(email, password);
      login(user);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-stone-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-rose-100 rounded-full flex items-center justify-center mb-4">
             <UtensilsCrossed className="h-6 w-6 text-rose-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Sign in to access your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-stone-300 rounded-lg placeholder-stone-400 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-shadow"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-stone-300 rounded-lg placeholder-stone-400 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-shadow"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-rose-600 text-sm text-center bg-rose-50 py-2 rounded-lg">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-stone-900 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 transition-all shadow-md hover:shadow-lg"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
            <Link to="/register" className="text-stone-600 hover:text-rose-600 text-sm font-medium transition-colors">
                New here? Create an account
            </Link>
        </div>
      </div>
    </div>
  );
};
