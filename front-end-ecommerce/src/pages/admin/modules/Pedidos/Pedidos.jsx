import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pedidos.css';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8080/api/pedidos';

  const obtenerPedidos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/info`);
      const pedidosData = Array.isArray(response.data) ? response.data : [];
      setPedidos(pedidosData);
      setError(null);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      setError('Error al cargar los pedidos');
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPedidos();
  }, []);

  if (loading) {
    return <div className="loading">Cargando pedidos...</div>;
  }

  return (
    <div className="pedidos-container">
      <h2 className="pedidos-titulo">Gestión de Pedidos</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="tabla-container">
        <table className="pedidos-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Comprador</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{new Date(pedido.fechaPedido).toLocaleString()}</td>
                <td>{pedido.usernameComprador}</td>
                <td>
                  <ul>
                    {pedido.productos.map((producto, index) => (
                      <li key={index}>
                        {producto.nombreProducto} - Cantidad: {producto.cantidad} - Precio: ${producto.precioUnitario.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>${pedido.total.toFixed(2)}</td>
                <td>{pedido.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pedidos;