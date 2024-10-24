import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import RoutesConfig from './routes'
import { CartProvider } from './context/CartContext.jsx';

function App() {
  return (
    <CartProvider>
      <Router>
          <RoutesConfig />
      </Router>
      <Toaster/>
    </CartProvider>
  );
}

export default App;
