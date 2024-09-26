import React, { useContext, useState } from 'react';
import './ShoppingCart.css';
import { CartContext } from '../../context/CartContext';

export default function ShoppingCart() {
  const { cartItems, removeItem, updateQuantity } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleDecreaseQuantity = (title, quantity) => {
    if (quantity > 1) {
      updateQuantity(title, quantity - 1);
    } else {
      removeItem(title);
    }
  };

  const handleIncreaseQuantity = (title, quantity) => {
    updateQuantity(title, quantity + 1);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
  <div className="card-content">
      <div className="flex">
        <div className="cart-section">
          <a href="#" className="back-link">
            <span className="back-icon">←</span>
            Continuar comprando
          </a>
          <h2 className="cart-title">Carrito de Compras</h2>
          <p className="cart-count">Tienes {cartItems.length} artículos en tu carrito</p>
          {cartItems.map((item) => (
            <div key={item.title} className="cart-item">
              <div className="item-details">
                <img src={item.image} alt={item.name} className="item-image" />
                <div>
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                </div>
              </div>
              <div className="item-actions">
                <div className="quantity-control">
                  <button 
                    className="quantity-button"
                    onClick={() => handleDecreaseQuantity(item.title, item.quantity)}
                    aria-label={`Disminuir cantidad de ${item.name}`}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="quantity-button"
                    onClick={() => handleIncreaseQuantity(item.title, item.quantity)}
                    aria-label={`Aumentar cantidad de ${item.name}`}
                  >
                    +
                  </button>
                </div>
                <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                <button 
                  className="remove-button"
                  onClick={() => removeItem(item.title)}
                  aria-label={`Eliminar ${item.name} del carrito`}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
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
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <input className="input" placeholder="MM/AA" />
                  <input className="input" placeholder="CVV" />
                </div>
              </form>
            )}
            {paymentMethod === 'bitcoin' && (
              <div className="payment-form">
                <input className="input" placeholder="Dirección de Bitcoin" />
                <p style={{fontSize: '0.875rem', marginTop: '1rem'}}>
                  Envía el pago a la siguiente dirección de Bitcoin: 
                </p>
              </div>
            )}
            <div className="total-section">
              <div className="total-row final">
                <p>Total</p>
                <p>${(total).toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div style={{padding: '1.5rem'}}>
            <button className="checkout-button" disabled={!paymentMethod}>
              Pagar ${(total).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
