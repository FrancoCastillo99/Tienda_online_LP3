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
  const [cryptoRates, setCryptoRates] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);

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
      console.error("Error al crear el pedido:", error);
      throw error;
    }
  };

  const crearPedidoFirebase = async () => {
    if (!user) {
      console.log("No hay usuario autenticado");
      return;
    }

    const pedido = {
      userId: user.uid,
      productos: cartItems.map((item) => ({
        productoId: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
      })),
      total: total,
      estado: 'PENDIENTE'
    };

    try {
      await crearPedido(pedido);
      console.log('Pedido creado:', pedido);
    } catch (error) {
      console.error('Error al crear el pedido:', error);
    }
  };

  const crearPedidoCrypto = async () => {
    if (!user) {
      console.log("No hay usuario autenticado");
      return;
    }
  
    if (!selectedCrypto || !cryptoRates) {
      console.error("No se ha seleccionado una criptomoneda o no se han cargado las tasas");
      return;
    }
  
    const cryptoAmount = calculateCryptoAmount();
    const pesosAmount = convertCryptoToPesos(cryptoAmount, selectedCrypto);

    console.log("Monto en criptomonedas:", cryptoAmount);
    console.log("Monto en pesos argentinos:", pesosAmount);
  
    const pedido = {
      userId: user.uid,
      productos: cartItems.map((item) => ({
        productoId: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
      })),
      total: pesosAmount,
      estado: 'PENDIENTE'
    };
  
    try {
      const pedidoCreado = await crearPedido(pedido);
      console.log('Pedido creado con criptomoneda:', pedidoCreado);
      return pedidoCreado;
    } catch (error) {
      console.error('Error al crear el pedido con criptomoneda:', error);
      throw error;
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

  const fetchCryptoRates = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/crypto/precios');
      setCryptoRates(response.data);
    } catch (error) {
      console.error('Error al obtener las tasas de criptomonedas:', error);
    }
  };

  // Convierte el total en pesos argentinos a la cantidad de criptomonedas seleccionada
  const calculateCryptoAmount = () => {
    if (!cryptoRates || !selectedCrypto || !cryptoRates[selectedCrypto]) {
        console.error("Error: Tasas de criptomonedas no disponibles o criptomoneda no seleccionada.");
        return 0;
    }

    // Asegúrate de obtener el valor en USD desde cryptoRates[selectedCrypto].usd
    const cryptoRateInUSD = cryptoRates[selectedCrypto].usd;

    // Convierte de pesos a dólares
    const dollarAmount = total / 992; // Tasa de ejemplo para ARS a USD

    // Convierte de dólares a la cantidad de criptomonedas
    const cryptoAmount = dollarAmount / cryptoRateInUSD;

    // Retorna con precisión de hasta 8 decimales
    return parseFloat(cryptoAmount.toFixed(8));
  };

  // Convierte una cantidad en criptomonedas a pesos argentinos
  const convertCryptoToPesos = (cryptoAmount, cryptoType) => {
    if (!cryptoRates || !cryptoType || !cryptoRates[cryptoType]) {
        console.error("Error: Tasas de criptomonedas no disponibles o tipo de criptomoneda no válido.");
        return 0;
    }

    // Asegúrate de obtener el valor en USD desde cryptoRates[cryptoType].usd
    const cryptoRateInUSD = cryptoRates[cryptoType].usd;

    // Convierte de criptomonedas a dólares
    const dollarAmount = cryptoAmount * cryptoRateInUSD;

    // Convierte de dólares a pesos argentinos
    const pesosAmount = dollarAmount * 992; // Tasa de ejemplo para USD a ARS

    // Retorna con dos decimales de precisión
    return parseFloat(pesosAmount.toFixed(2));
  };


  const handleCryptoPayment = async () => {
    setIsProcessing(true);
    try {
      const pedidoCreado = await crearPedidoCrypto();
      setOrderId(pedidoCreado.id);
      setPaymentStatus('success');
      clearCart();
    } catch (error) {
      console.error('Error al procesar el pago con criptomoneda:', error);
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
    } else if (paymentMethod === 'crypto') {
      await handleCryptoPayment();
    }
  };

  useEffect(() => {
    fetchCryptoRates();
    const isProcessingPayment = localStorage.getItem('isProcessingPayment');
    if (isProcessingPayment) {
      clearCart();
      setPaymentStatus('success');
      localStorage.removeItem('isProcessingPayment');
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
              className={`payment-method ${paymentMethod === 'crypto' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('crypto')}
            >
              <span className="payment-icon">₿</span>
              Criptomoneda
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

            {paymentMethod === 'crypto' && (
              <div className="crypto-payment-form">
                <select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="crypto-select"
                >
                  <option value="">Selecciona una criptomoneda</option>
                  <option value="bitcoin">Bitcoin</option>
                  <option value="ethereum">Ethereum</option>
                </select>
                {selectedCrypto && (
                  <p className="crypto-amount">
                    Monto a pagar: {calculateCryptoAmount().toFixed(8)} {selectedCrypto}
                  </p>
                )}
                <button
                  className="crypto-pay-button"
                  onClick={handleCryptoPayment}
                  disabled={!selectedCrypto || isProcessing}
                >
                  {isProcessing ? 'Procesando...' : `Pagar con ${selectedCrypto || 'criptomoneda'}`}
                </button>
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