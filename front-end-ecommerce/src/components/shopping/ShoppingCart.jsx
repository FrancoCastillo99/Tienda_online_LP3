import React, { useContext, useState } from 'react';
import './ShoppingCart.css';
import { CartContext } from '../../context/CartContext';

export default function ShoppingCart() {
  const { cartItems, removeItem, updateQuantity } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleDecreaseQuantity = (nombre, cantidad) => { 
    if (cantidad > 1) {
      updateQuantity(nombre, cantidad - 1);
    } else {
      removeItem(nombre);
    }
  };

  const handleIncreaseQuantity = (nombre, cantidad) => { 
    updateQuantity(nombre, cantidad + 1);
  };

  // Asegúrate de que estás utilizando el nombre correcto del campo de precio
  const total = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0); 

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
                <p className="item-price">${(item.precio * item.cantidad).toFixed(2)}</p> {/* Asegúrate de que el campo precio sea correcto */}
                <button 
                  className="remove-button"
                  onClick={() => removeItem(item.nombre)}
                  aria-label={`Eliminar ${item.nombre} del carrito`} // Cambiado a titulo
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
                <p>${(total).toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <button className="checkout-button" disabled={!paymentMethod}>
              Pagar ${(total).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
