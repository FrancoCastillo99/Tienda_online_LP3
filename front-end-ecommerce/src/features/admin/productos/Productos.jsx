import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Productos.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    imagenUrl: '',
    categoria: '',
    stock: ''
  });
  const [modo, setModo] = useState('crear');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [modalAbierto, setModalAbierto] = useState(false);

  const API_URL = 'http://localhost:8080/api/productos';

  const obtenerProductos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      const productosData = Array.isArray(response.data) ? response.data : [];
      setProductos(productosData);
      setError(null);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      setError('Error al cargar los productos');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const response = await axios.get(API_URL);
      const productosData = Array.isArray(response.data) ? response.data : [];
      const categoriasUnicas = [...new Set(productosData
        .map(p => p.categoria)
        .filter(categoria => categoria))
      ];
      setCategorias(categoriasUnicas);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      setCategorias([]);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []);

  const obtenerProductosPorCategoria = async (categoria) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/categoria/${categoria}`);
      const productosData = Array.isArray(response.data) ? response.data : [];
      setProductos(productosData);
      setError(null);
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      setError('Error al cargar los productos por categoría');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const agregarMovimiento = async (productoId, cantidad, costo) => {
    const monto = cantidad * costo;
  
    const movimientoGasto = {
      concepto: `Reposición de stock para ${productoSeleccionado.nombre}`,
      monto: monto,
      tipo: 'Gasto',
    };
  
    const movimientoIngreso = {
      concepto: `Ingreso por reposición de stock de ${productoSeleccionado.nombre}`,
      monto: monto,
      tipo: 'Ingreso',
    };
  
    try {
      const mercaderiaId = '8GfMDAYy4eUXzjgjiWZi'; // ID de la cuenta "Mercadería"
      const cajaId = 'q6Uy4kPWFF9O2UI55Kag'; // Reemplaza con el ID de la cuenta "Caja"
  
      // Agregar el movimiento como gasto en la cuenta "Mercadería"
      const responseGasto = await axios.put(`http://localhost:8080/api/libro/actualizar/${mercaderiaId}/movimiento`, movimientoGasto);
      console.log(responseGasto.data);
  
      // Agregar el movimiento como ingreso en la cuenta "Caja"
      const responseIngreso = await axios.put(`http://localhost:8080/api/libro/actualizar/${cajaId}/movimiento`, movimientoIngreso);
      console.log(responseIngreso.data);
  
    } catch (error) {
      console.error('Error al agregar los movimientos:', error);
      setError('Error al agregar los movimientos');
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productoData = {
        ...productoSeleccionado,
        precio: parseFloat(productoSeleccionado.precio),
        stock: parseInt(productoSeleccionado.stock, 10)
      };
  
      // Verificar si el stock ha cambiado para agregar un movimiento
      if (modo === 'editar') {
        const productoOriginal = productos.find(p => p.id === productoSeleccionado.id);
        if (productoOriginal && productoOriginal.stock !== productoSeleccionado.stock) {
          const cantidadAAgregar = productoSeleccionado.stock - productoOriginal.stock;
          await agregarMovimiento(productoSeleccionado.id, cantidadAAgregar, productoSeleccionado.precio);
        }
      }
  
      // Guardar o actualizar el producto
      if (modo === 'crear') {
        await axios.post(API_URL, productoData);
      } else {
        await axios.put(`${API_URL}/${productoData.id}`, productoData);
      }
  
      // Resetear los valores después de guardar
      setProductoSeleccionado({
        nombre: '',
        precio: '',
        descripcion: '',
        imagenUrl: '',
        categoria: '',
        stock: ''
      });
      setModo('crear');
      setModalAbierto(false);
      if (categoriaSeleccionada === 'todas') {
        obtenerProductos();
      } else {
        obtenerProductosPorCategoria(categoriaSeleccionada);
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setError('Error al guardar el producto');
    }
  };
  
  const eliminarProducto = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        if (categoriaSeleccionada === 'todas') {
          obtenerProductos();
        } else {
          obtenerProductosPorCategoria(categoriaSeleccionada);
        }
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        setError('Error al eliminar el producto');
      }
    }
  };

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setModo('editar');
    setModalAbierto(true);
  };

  const handleCategoriaChange = (e) => {
    const categoria = e.target.value;
    setCategoriaSeleccionada(categoria);
    if (categoria === 'todas') {
      obtenerProductos();
    } else {
      obtenerProductosPorCategoria(categoria);
    }
  };

  const abrirModalCrear = () => {
    setProductoSeleccionado({
      nombre: '',
      precio: '',
      descripcion: '',
      imagenUrl: '',
      categoria: '',
      stock: ''
    });
    setModo('crear');
    setModalAbierto(true);
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="productos-container">
      <h2 className="productos-titulo">Gestión de Productos</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="controles-superiores">
        <button onClick={abrirModalCrear} className="btn btn-primary">
          Agregar Producto
        </button>
        <div className="filtro-categoria">
          <select 
            value={categoriaSeleccionada}
            onChange={handleCategoriaChange}
            className="select-categoria"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="tabla-container">
        <table className="productos-tabla">
          <thead>
            <tr>
              <th className="col-nombre">Nombre</th>
              <th className="col-descripcion">Descripción</th>
              <th className="col-precio">Precio</th>
              <th className="col-categoria">Categoría</th>
              <th className="col-stock">Stock</th>
              <th className="col-imagen">Imagen</th>
              <th className="col-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td className="col-nombre">{producto.nombre}</td>
                <td className="col-descripcion">{producto.descripcion}</td>
                <td className="col-precio">${parseFloat(producto.precio).toFixed(2)}</td>
                <td className="col-categoria">{producto.categoria}</td>
                <td className="col-stock">{producto.stock}</td>
                <td className="col-imagen">
                  <img src={producto.imagenUrl} alt={producto.nombre} className="producto-imagen" />
                </td>
                <td className="col-acciones">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => seleccionarProducto(producto)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarProducto(producto.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div className="modal">
          <div className="modal-content">
            <h3>{modo === 'crear' ? 'Crear Nuevo Producto' : 'Editar Producto'}</h3>
            <form onSubmit={handleSubmit} className="productos-form">
              <input
                type="text"
                placeholder="Nombre del producto"
                value={productoSeleccionado.nombre}
                onChange={(e) => setProductoSeleccionado({...productoSeleccionado, nombre: e.target.value})}
                required
                className="form-input"
              />
              
              <input
                type="number"
                placeholder="Precio"
                value={productoSeleccionado.precio}
                onChange={(e) => setProductoSeleccionado({...productoSeleccionado, precio: e.target.value})}
                required
                className="form-input"
              />

              <input
                type="text"
                placeholder="Categoría"
                value={productoSeleccionado.categoria}
                onChange={(e) => setProductoSeleccionado({...productoSeleccionado, categoria: e.target.value})}
                required
                className="form-input"
              />

              <textarea
                placeholder="Descripción"
                value={productoSeleccionado.descripcion}
                onChange={(e) => setProductoSeleccionado({...productoSeleccionado, descripcion: e.target.value})}
                className="form-textarea"
              />

              <input
                type="text"
                placeholder="URL de la imagen"
                value={productoSeleccionado.imagenUrl}
                onChange={(e) => setProductoSeleccionado({...productoSeleccionado, imagenUrl: e.target.value})}
                className="form-input"
              />

              <input
                type="number"
                placeholder="Stock"
                value={productoSeleccionado.stock}
                onChange={(e) => setProductoSeleccionado({...productoSeleccionado, stock: e.target.value})}
                required
                className="form-input"
              />

              <div className="form-buttons">
                <button type="submit" className="btn btn-primary">
                  {modo === 'crear' ? 'Crear Producto' : 'Actualizar Producto'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;