import React, { useState } from 'react';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Product from './pages/Product';
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Checkout from "./pages/Checkout";
import EmployeeSignin from "./pages/EmployeeSignin";
import Admin from './pages/Admin'; // Admin panel page
import EmployeeProfile from './pages/EmployeeProfile'
import { Route, Routes } from 'react-router-dom';
import { CartProvider } from "./helpers/CartContext";
import CategoryBar from './components/CategoryBar';
import TopBar from './components/TopBar';
import { AdminRoute, NonAdminRoute } from './helpers/AdminRouter'; // Route guards

function App() {
  const [isAdmin, setIsAdmin] = useState(false); // Initially not an admin
  const handleLoginSuccess = (isAdmin) => { setIsAdmin(isAdmin); console.log("Admin: " + isAdmin) };

  return (
    <CartProvider>
      {!isAdmin && <TopBar />} 
      {!isAdmin && <CategoryBar />}
      <div className='routes-container'>
        <Routes>
          <Route path="/" element={<NonAdminRoute isAdmin={isAdmin}><Home /></NonAdminRoute>} />
          <Route path="/cart" element={<NonAdminRoute isAdmin={isAdmin}><Cart /></NonAdminRoute>} />
          <Route path="/product" element={<NonAdminRoute isAdmin={isAdmin}><Product /></NonAdminRoute>} />
          <Route path="/search" element={<NonAdminRoute isAdmin={isAdmin}><Search /></NonAdminRoute>} />
          <Route path="/signin" element={<Signin onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<NonAdminRoute isAdmin={isAdmin}><Profile /></NonAdminRoute>} />
          <Route path="/checkout" element={<NonAdminRoute isAdmin={isAdmin}><Checkout /></NonAdminRoute>} />
          <Route path="/employeesignin" element={<NonAdminRoute isAdmin={isAdmin}><EmployeeSignin onLoginSuccess={handleLoginSuccess} /></NonAdminRoute>} />
          <Route path="/employee" element={<NonAdminRoute isAdmin={isAdmin}><EmployeeProfile /></NonAdminRoute>} />
          <Route path="/admin" element={<AdminRoute isAdmin={isAdmin}><Admin setAdmin={setIsAdmin}/></AdminRoute>} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
