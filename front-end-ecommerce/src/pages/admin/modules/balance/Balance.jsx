import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Balance.css';

const Balance = () => {
  const [balanceDiario, setBalanceDiario] = useState(null);
  const [balancePeriodo, setBalancePeriodo] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [servicios, setServicios] = useState({
    luz: 0,
    agua: 0,
    gas: 0
  });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerBalanceDiario(fecha);
  }, [fecha]);

  const obtenerBalanceDiario = async (fecha) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/libro-diario/balance/diario?fecha=${fecha}`);
      setBalanceDiario(response.data);
    } catch (error) {
      console.error('Error al obtener el balance diario:', error);
      setBalanceDiario(null);
    }
  };

  const obtenerBalancePeriodo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8080/api/libro-diario/balance/periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
      setBalancePeriodo(response.data);
    } catch (error) {
      console.error('Error al obtener el balance del periodo:', error);
    }
  };

  const pagarServicios = async () => {
    try {
      const totalServicios = Object.values(servicios).reduce((a, b) => a + b, 0);
      await axios.post('http://localhost:8080/api/libro-diario/movimiento', {
        concepto: 'Pago de servicios',
        monto: totalServicios,
        tipo: 'GASTO'
      });
      setMensaje('Servicios pagados correctamente');
      obtenerBalanceDiario(fecha);
      setServicios({ luz: 0, agua: 0, gas: 0 });
    } catch (error) {
      console.error('Error al pagar servicios:', error);
      setMensaje('Error al pagar servicios');
    }
  };

  const handleServicioChange = (servicio, valor) => {
    setServicios(prev => ({ ...prev, [servicio]: parseFloat(valor) || 0 }));
  };

  const crearLibroDiario = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/libro-diario/crear', { fecha });
      setMensaje(response.data.mensaje);
      obtenerBalanceDiario(fecha);
    } catch (error) {
      console.error('Error al crear LibroDiario:', error);
      setMensaje('Error al crear LibroDiario');
    }
  };

  return (
    <div className="balance-container">
      <h1>Balance</h1>
      
      <div className="balance-diario">
        <h2>Balance Diario</h2>
        <input 
          type="date" 
          value={fecha} 
          onChange={(e) => setFecha(e.target.value)}
        />
        <button onClick={crearLibroDiario}>Crear LibroDiario</button>
        {mensaje && <p className="mensaje">{mensaje}</p>}
        {balanceDiario ? (
          <div className="balance-info" onClick={() => setMostrarDetalles(!mostrarDetalles)}>
            <p>Fecha: {balanceDiario.fecha}</p>
            <p>Ingresos: ${balanceDiario.ingresos.toFixed(2)}</p>
            <p>Gastos: ${balanceDiario.gastos.toFixed(2)}</p>
            <p>Balance: ${balanceDiario.balance.toFixed(2)}</p>
            {mostrarDetalles && (
              <table className="movimientos-tabla">
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>Monto</th>
                    <th>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {balanceDiario.movimientos.map((movimiento, index) => (
                    <tr key={index}>
                      <td>{movimiento.concepto}</td>
                      <td>${movimiento.monto.toFixed(2)}</td>
                      <td>{movimiento.tipo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <p>No hay LibroDiario para esta fecha</p>
        )}
      </div>

      <div className="pago-servicios">
        <h2>Pago de Servicios</h2>
        <div className="servicios-inputs">
          <label>
            Luz: $
            <input 
              type="number" 
              value={servicios.luz} 
              onChange={(e) => handleServicioChange('luz', e.target.value)}
            />
          </label>
          <label>
            Agua: $
            <input 
              type="number" 
              value={servicios.agua} 
              onChange={(e) => handleServicioChange('agua', e.target.value)}
            />
          </label>
          <label>
            Gas: $
            <input 
              type="number" 
              value={servicios.gas} 
              onChange={(e) => handleServicioChange('gas', e.target.value)}
            />
          </label>
        </div>
        <button onClick={pagarServicios}>Pagar Servicios</button>
      </div>

      <div className="balance-periodo">
        <h2>Balance por Periodo</h2>
        <form onSubmit={obtenerBalancePeriodo}>
          <input 
            type="date" 
            value={fechaInicio} 
            onChange={(e) => setFechaInicio(e.target.value)}
            required
          />
          <input 
            type="date" 
            value={fechaFin} 
            onChange={(e) => setFechaFin(e.target.value)}
            required
          />
          <button type="submit">Obtener Balance</button>
        </form>
        {balancePeriodo.length > 0 && (
          <div className="balance-list">
            {balancePeriodo.map((balance, index) => (
              <div key={index} className="balance-item">
                <p>Fecha: {balance.fecha}</p>
                <p>Ingresos: ${balance.ingresos.toFixed(2)}</p>
                <p>Gastos: ${balance.gastos.toFixed(2)}</p>
                <p>Balance: ${balance.balance.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Balance;