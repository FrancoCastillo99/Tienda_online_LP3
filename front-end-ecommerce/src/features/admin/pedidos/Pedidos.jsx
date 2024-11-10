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
      
      const pedidosOrdenados = pedidosData.sort((a, b) => {
        return new Date(b.fechaPedido) - new Date(a.fechaPedido);
      });
      
      setPedidos(pedidosOrdenados);
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
              <th>Fecha</th>
              <th>Comprador</th>
              <th>Productos</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{new Date(pedido.fechaPedido).toLocaleString()}</td>
                <td>{pedido.usernameComprador}</td>
                <td>
                  <ul className="productos-lista">
                    {pedido.productos.map((producto, index) => (
                      <li key={index} className="producto-item">
                        <span className="producto-nombre">{producto.nombreProducto}</span>
                        <span className="producto-cantidad">
                          <span className="etiqueta">Cantidad:</span> {producto.cantidad}
                        </span>
                        <span className="producto-precio">
                          <span className="etiqueta">Precio:</span> ${producto.precioUnitario.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td>${pedido.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pedidos;
