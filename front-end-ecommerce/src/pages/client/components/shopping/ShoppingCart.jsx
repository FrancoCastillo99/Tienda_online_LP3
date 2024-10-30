import React, { useContext, useState } from 'react';
import './ShoppingCart.css';
import { CartContext } from '../../context/CartContext';

export default function ShoppingCart({ onClose }) {
  const { cartItems, removeItem, updateQuantity } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleDecreaseQuantity = (nombre, cantidad) => { 
    if (cantidad > 1) {
      updateQuantity(nombre, cantidad - 1, cantidad);
    } else {
      removeItem(nombre, true);
    }
  };

  const handleIncreaseQuantity = (nombre, cantidad) => { 
    updateQuantity(nombre, cantidad + 1, cantidad);
  };

  const total = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        {/* Left Section */}
        <div className="card-content">
          <button onClick={onClose} className="back-link">
            <span className="back-icon">←</span>
            Continuar comprando
          </button>
          <h2 className="cart-title">Carrito de Compras</h2>
          <p className="cart-count">Tienes {cartItems.length} artículos en tu carrito</p>
          <div className="cart-section">
            {cartItems.map((item) => (
              <div key={item.nombre} className="cart-item"> 
                <div className="item-details">
                  <img src={item.imagenUrl} alt={item.nombre} className="item-image" /> 
                  <div>
                    <h3 className="item-name">{item.nombre}</h3> 
                  </div>
                </div>
                <div className="item-actions">
                  <div className="quantity-control">
                    <button 
                      className="quantity-button"
                      onClick={() => handleDecreaseQuantity(item.nombre, item.cantidad)}
                      aria-label={`Disminuir cantidad de ${item.nombre}`} 
                    >
                      -
                    </button>
                    <span className="quantity">{item.cantidad}</span> 
                    <button 
                      className="quantity-button"
                      onClick={() => handleIncreaseQuantity(item.nombre, item.cantidad)} 
                      aria-label={`Aumentar cantidad de ${item.nombre}`} 
                    >
                      +
                    </button>
                  </div>
                  <p className="item-price">${(item.precio * item.cantidad).toFixed(2)}</p>
                  <button 
                    className="remove-button"
                    onClick={() => removeItem(item.nombre, true)}
                    aria-label={`Eliminar ${item.nombre} del carrito`}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="payment-section">
          <div className="payment-header">
            <h2 className="payment-title">Métodos de pago</h2>
          </div>
          <div className="payment-content">
            <button
              className={`payment-method ${paymentMethod === 'mercadopago' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('mercadopago')}
            >
              <span className="payment-icon">💳</span>
              Mercado Pago
            </button>
            <button
              className={`payment-method ${paymentMethod === 'bitcoin' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('bitcoin')}
            >
              <span className="payment-icon">₿</span>
              Bitcoin
            </button> 
            {paymentMethod === 'mercadopago' && (
              <form className="payment-form">
                <input className="input" placeholder="Número de tarjeta" />
                <input className="input" placeholder="Nombre del titular" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input className="input" placeholder="MM/AA" />
                  <input className="input" placeholder="CVV" />
                </div>
              </form>
            )}
            {paymentMethod === 'bitcoin' && (
              <div className="payment-form">
                <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
                  Envía el pago a la siguiente dirección de Bitcoin: 
                </p>
                <input className="input" placeholder="Dirección de Bitcoin" />
              </div>
            )}
            <div className="total-section">
              <div className="total-row final">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
            <div className="checkout-button-container">
              <button className="checkout-button" disabled={!paymentMethod}>
                Pagar ${total.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}