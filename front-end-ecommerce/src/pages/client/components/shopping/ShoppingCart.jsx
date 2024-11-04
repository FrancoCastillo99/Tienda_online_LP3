import React, { useContext, useState, useEffect } from 'react';
import './ShoppingCart.css';
import { CartContext } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';

// Inicializa MercadoPago con tu PUBLIC_KEY
initMercadoPago('APP_USR-819e8c0a-f7eb-4172-9efd-bc38be75c644');

export default function ShoppingCart({ onClose }) {
  const { user } = useUser();
  const { cartItems, removeItem, updateQuantity, clearCart } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);

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

  const total = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const crearPedido = async (pedido) => {
    try {
      const response = await axios.post('http://localhost:8080/api/pedidos', pedido);
      return response.data;
    } catch (error) {
      console.error("Error al crear el pedido en Firebase:", error);
      throw error;
    }
  };

  const crearPedidoFirebase = async () => {
    if (!user) {
      console.log("No hay usuario autenticado");
      return;
    }

    const pedido = {
      userId: user.uid, // Usar el userId del usuario autenticado
      productos: cartItems.map((item) => ({
        productoId: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
      })),
      total: total,
      estado: 'PENDIENTE' // Cambiado a PENDIENTE
    };

    try {
      await crearPedido(pedido); // Llama a la función crearPedido para guardar el pedido en Firebase
      console.log('Pedido creado en Firebase:', pedido);
    } catch (error) {
      console.error('Error al crear el pedido en Firebase:', error);
    }
  };

  const createPreference = async () => {
    try {
      setIsProcessing(true);
      const items = cartItems.map(item => ({
        titulo: item.nombre,
        descripcion: item.descripcion || item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        imagenUrl: item.imagenUrl
      }));

      const newOrderId = Date.now().toString();
      setOrderId(newOrderId);

      const response = await axios.post('http://localhost:8080/api/pagos/crear-preferencia', {
        items: items,
        idPedido: newOrderId
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const { preferenceId } = response.data;
      setPreferenceId(preferenceId);
      console.log('Preferencia creada');
    } catch (error) {
      console.error('Error al crear la preferencia:', error);
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };



  const handleCheckout = async () => {
    if (paymentMethod === 'mercadopago') {
      await createPreference();
      await crearPedidoFirebase();

      localStorage.setItem('isProcessingPayment', 'true');

    }
  };

  useEffect(() => {
    // Verificar si el pago estaba en proceso al recargar la página
    const isProcessingPayment = localStorage.getItem('isProcessingPayment');
    if (isProcessingPayment) {
      // Limpiar el carrito inmediatamente
      clearCart();
      setPaymentStatus('success');
      localStorage.removeItem('isProcessingPayment'); // Eliminar la marca después de limpiar
    }
  }, []);

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
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
                    onClick={() => removeItem(item.nombre)}
                    aria-label={`Eliminar ${item.nombre} del carrito`}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
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

            {paymentMethod === 'mercadopago' && preferenceId && (
              <div className="mercadopago-button-container">
                <Wallet 
                  initialization={{ preferenceId: preferenceId }}
                  onReady={() => console.log("Wallet ready")}
                  onError={(error) => {
                    console.error('Error:', error);
                    setPaymentStatus('error');
                  }}
                />
              </div>
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
              <button 
                className="checkout-button" 
                disabled={!paymentMethod || isProcessing || paymentStatus === 'success'}
                onClick={handleCheckout}
              >
                {isProcessing ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
              </button>
            </div>
            {paymentStatus === 'success' && (
              <p className="success-message">¡Pago realizado con éxito! Tu pedido ha sido registrado.</p>
            )}
            {paymentStatus === 'error' && (
              <p className="error-message">Hubo un error al procesar el pago. Por favor, intenta nuevamente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
