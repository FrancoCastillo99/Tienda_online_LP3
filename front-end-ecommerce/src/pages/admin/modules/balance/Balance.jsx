import React, { useState, useEffect } from 'react';
import './Balance.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const Balance = () => {
  const [libros, setLibros] = useState([]);
  const [libroMayor, setLibroMayor] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovimientos, setSelectedMovimientos] = useState([]);
  const [selectedService, setSelectedService] = useState('agua');
  const [serviceAmount, setServiceAmount] = useState('');
  const [serviceError, setServiceError] = useState('');

  useEffect(() => {
    fetchLibros();
    fetchLibroMayor();
  }, []);

  const fetchLibros = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/libro');
      if (!response.ok) {
        throw new Error('Error al obtener los libros');
      }
      const data = await response.json();
      setLibros(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchLibroMayor = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/libro/libroMayor');
      if (!response.ok) {
        throw new Error('Error al obtener el Libro Mayor');
      }
      const data = await response.json();
      setLibroMayor(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };

  const handleVerMovimientos = (movimientos) => {
    setSelectedMovimientos(movimientos);
    setIsModalOpen(true);
  };

  const handlePagoServicio = async () => {
    if (!serviceAmount || isNaN(serviceAmount) || serviceAmount <= 0) {
      setServiceError('Por favor ingrese un monto válido');
      return;
    }
    const movimientoDTO = {
      concepto: `${selectedService} - Pago`,
      monto: parseFloat(serviceAmount),
      tipo: 'Gasto',
    };

    try {
      const response = await fetch(`http://localhost:8080/api/libro/actualizar/y5t1i0yHyA0GJqiQR78U/movimiento`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movimientoDTO),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el movimiento');
      }

      const data = await response.json();
      alert(data.mensaje);
      setServiceAmount('');
      setServiceError('');
    } catch (error) {
      setServiceError(error.message);
    }
  };

  if (error) {
    return <div className="error-message" role="alert">{error}</div>;
  }

  return (
    <div className="balance-container">
      <h1>Libros de Contabilidad</h1>

      {/* Sección para pagar servicios */}
      <div className="service-payment">
        <h2>Pago de Servicios</h2>
        <div className="service-selector">
          <label htmlFor="service-type">Seleccionar servicio:</label>
          <select
            id="service-type"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="agua">Agua</option>
            <option value="luz">Luz</option>
            <option value="gas">Gas</option>
          </select>
        </div>
        <div className="service-amount">
          <label htmlFor="amount">Monto a pagar:</label>
          <input
            type="number"
            id="amount"
            value={serviceAmount}
            onChange={(e) => setServiceAmount(e.target.value)}
            min="0"
            step="any"
          />
        </div>
        {serviceError && <div className="error-message">{serviceError}</div>}
        <button onClick={handlePagoServicio} className="payment-btn">Pagar Servicio</button>
      </div>

      {/* Tabla de Libros Diarios */}
      <table className="balance-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Ingresos</th>
            <th>Gastos</th>
            <th>Balance</th>
            <th>Movimientos</th>
          </tr>
        </thead>
        <tbody>
          {libros.map((libro) => (
            <tr key={libro.id}>
              <td>{libro.id}</td>
              <td>{new Date().toLocaleDateString()}</td>
              <td>{formatCurrency(libro.ingresos)}</td>
              <td>{formatCurrency(libro.gastos)}</td>
              <td>{formatCurrency(libro.balance)}</td>
              <td>
                <button 
                  className="view-movements-btn" 
                  onClick={() => handleVerMovimientos(libro.movimientos)}
                  aria-label={`Ver movimientos del libro ${libro.id}`}
                >
                  Ver Movimientos
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Movimientos */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Movimientos</h2>
        <table className="movements-table">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {selectedMovimientos.map((movimiento, index) => (
              <tr key={index}>
                <td>{movimiento.concepto}</td>
                <td>{formatCurrency(movimiento.monto)}</td>
                <td>{movimiento.tipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>

      {/* Sección del Libro Mayor */}
      {libroMayor && (
        <div className="libro-mayor">
          <h2>Libro Mayor</h2>
          <table className="balance-table">
            <thead>
              <tr>
                <th>Ingresos Totales</th>
                <th>Pagos Totales</th>
                <th>Balance Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatCurrency(libroMayor.ingresosTotales)}</td>
                <td>{formatCurrency(libroMayor.pagosTotales)}</td>
                <td>{formatCurrency(libroMayor.balanceTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Balance;

