import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoutesConfig from './routes'
import { CartProvider } from './context/CartContext.jsx';

function App() {
  return (
    <CartProvider>
      <Router>
          <RoutesConfig />
      </Router>
    </CartProvider>
  );
}

export default App;
