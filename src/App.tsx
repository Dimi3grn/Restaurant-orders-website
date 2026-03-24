import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { RecipeDetails } from './pages/RecipeDetails';
import { Orders } from './pages/Orders';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminRecipeForm } from './pages/AdminRecipeForm';
import { AdminOrders } from './pages/AdminOrders';

// Layout component defined inside App.tsx to ensure it has access to AuthContext
const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute allowedRoles={['client', 'admin']}>
                  <Orders />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminOrders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/recipes/new" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminRecipeForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/recipes/:id/edit" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminRecipeForm />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
