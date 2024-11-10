import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import RoutesConfig from './routes'
import { CartProvider } from '../src/features/shoppingCart/CartContext';
import { UserProvider } from '../src/features/context/UserContext';

function App() {
  return (
    <UserProvider>
    <CartProvider>
      <Router>
          <RoutesConfig />
      </Router>
      <Toaster/>
    </CartProvider>
    </UserProvider>
  );
}

export default App;
