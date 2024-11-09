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
  const [selectedAccount, setSelectedAccount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredMovimientos, setFilteredMovimientos] = useState([]);

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
    
    const movimientoGasto = {
      concepto: `${selectedService} - Pago`,
      monto: parseFloat(serviceAmount),
      tipo: 'Gasto',
    };
  
    const movimientoIngreso = {
      concepto: `Ingreso - ${selectedService} Pago`,
      monto: parseFloat(serviceAmount),
      tipo: 'Ingreso',
    };
  
    try {
      const serviciosId = 'ccJlysR6cKXmgaC8JxpX'; // ID de la cuenta "Servicios"
      const cajaId = 'q6Uy4kPWFF9O2UI55Kag'; // ID de la cuenta "Caja"
  
      // Agregar el movimiento como gasto en la cuenta "Servicios"
      const responseGasto = await fetch(`http://localhost:8080/api/libro/actualizar/${serviciosId}/movimiento`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movimientoGasto),
      });
  
      if (!responseGasto.ok) {
        throw new Error('Error al agregar el movimiento en Servicios');
      }
  
      // Agregar el movimiento como ingreso en la cuenta "Caja"
      const responseIngreso = await fetch(`http://localhost:8080/api/libro/actualizar/${cajaId}/movimiento`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movimientoIngreso),
      });
  
      if (!responseIngreso.ok) {
        throw new Error('Error al agregar el movimiento en Caja');
      }
  
      // Mostrar mensaje de éxito y limpiar campos
      const dataGasto = await responseGasto.json();
      const dataIngreso = await responseIngreso.json();
      alert(`Movimientos agregados: \nServicios: ${dataGasto.mensaje}\nCaja: ${dataIngreso.mensaje}`);
      setServiceAmount('');
      setServiceError('');
    } catch (error) {
      setServiceError(error.message);
    }
  };

  const handleAccountChange = (e) => {
    setSelectedAccount(e.target.value);
  };

  const handleDateChange = (e) => {
    if (e.target.name === 'startDate') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  useEffect(() => {
    if (selectedAccount && libros.length > 0) {
      const selectedLibro = libros.find(libro => libro.nombre === selectedAccount);
      if (selectedLibro) {
        let filtered = selectedLibro.movimientos;

        if (startDate && endDate) {
          filtered = filtered.filter(movimiento => {
            const movDate = new Date(movimiento.fecha.seconds * 1000);
            return movDate >= new Date(startDate) && movDate <= new Date(endDate);
          });
        }

        setFilteredMovimientos(filtered);
      }
    }
  }, [selectedAccount, startDate, endDate, libros]);

  if (error) {
    return <div className="error-message" role="alert">{error}</div>;
  }

  return (
    <div className="balance-container">
      <div className="balance-content">
        <h1>Libros de Contabilidad</h1>

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

        <table className="balance-table">
          <thead>
            <tr>
              <th>Cuenta</th>
              <th>Debe</th>
              <th>Haber</th>
              <th>Balance</th>
              <th>Movimientos</th>
            </tr>
          </thead>
          <tbody>
            {libros.map((libro) => (
              <tr key={libro.id}>
                <td className='balance-table-name'>{libro.nombre}</td>
                <td>{formatCurrency(libro.gastos)}</td>
                <td>{formatCurrency(libro.ingresos)}</td>
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

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Movimientos</h2>
          <table className="movements-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Debe</th>
                <th>Haber</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                let balanceAcumulado = 0;
                return selectedMovimientos.map((movimiento, index) => {
                  if (movimiento.tipo.toLowerCase() === 'gasto') {
                    balanceAcumulado += movimiento.monto;
                  } else if (movimiento.tipo.toLowerCase() === 'ingreso') {
                    balanceAcumulado -= movimiento.monto;
                  }
                  return (
                    <tr key={index}>
                      <td>{new Date(movimiento.fecha.seconds * 1000).toLocaleDateString()}</td>
                      <td>{movimiento.concepto}</td>
                      <td>
                        {movimiento.tipo.toLowerCase() === 'gasto' ? formatCurrency(movimiento.monto) : '-'}
                      </td>
                      <td>
                        {movimiento.tipo.toLowerCase() === 'ingreso' ? formatCurrency(movimiento.monto) : '-'}
                      </td>
                      <td>{formatCurrency(balanceAcumulado)}</td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </Modal>

        {libroMayor && (
          <div className="libro-mayor">
            <h2>Libro Mayor</h2>
            <div className="libro-mayor-filters">
              <select
                value={selectedAccount}
                onChange={handleAccountChange}
                className="account-select"
              >
                <option value="">Seleccionar cuenta</option>
                {libros.map((libro) => (
                  <option key={libro.id} value={libro.nombre}>
                    {libro.nombre}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="startDate"
                value={startDate}
                onChange={handleDateChange}
                className="date-input"
              />
              <input
                type="date"
                name="endDate"
                value={endDate}
                onChange={handleDateChange}
                className="date-input"
              />
            </div>
            <div className="libro-mayor-table-container">
              <table className="balance-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Concepto</th>
                    <th>Debe</th>
                    <th>Haber</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let balanceAcumulado = 0;
                    return filteredMovimientos.map((movimiento, index) => {
                      if (movimiento.tipo.toLowerCase() === 'gasto') {
                        balanceAcumulado += movimiento.monto;
                      } else if (movimiento.tipo.toLowerCase() === 'ingreso') {
                        balanceAcumulado -= movimiento.monto;
                      }
                      return (
                        <tr key={index}>
                          <td>{new Date(movimiento.fecha.seconds * 1000).toLocaleDateString()}</td>
                          <td>{movimiento.concepto}</td>
                          <td>
                            {movimiento.tipo.toLowerCase() === 'gasto' ? formatCurrency(movimiento.monto) : '-'}
                          </td>
                          <td>
                            {movimiento.tipo.toLowerCase() === 'ingreso' ? formatCurrency(movimiento.monto) : '-'}
                          </td>
                          <td>{formatCurrency(balanceAcumulado)}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Balance;