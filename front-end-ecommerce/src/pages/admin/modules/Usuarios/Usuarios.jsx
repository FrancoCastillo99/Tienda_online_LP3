import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Usuarios.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoRol, setNuevoRol] = useState('');

  const API_URL = 'http://localhost:8080/api/usuarios';

  const obtenerUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      const usuariosData = Array.isArray(response.data) ? response.data : [];
      setUsuarios(usuariosData);
      setError(null);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setError('Error al cargar los usuarios');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const actualizarRolUsuario = async (email, nuevoRol) => {
    try {
      await axios.put(`${API_URL}/${email}/rol?nuevoRol=${nuevoRol}`);
      obtenerUsuarios();
      setModalAbierto(false);
    } catch (error) {
      console.error('Error al actualizar rol de usuario:', error);
      setError('Error al actualizar el rol del usuario');
    }
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNuevoRol(usuario.rol);
    setModalAbierto(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usuarioSeleccionado && nuevoRol) {
      actualizarRolUsuario(usuarioSeleccionado.email, nuevoRol);
    }
  };

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="usuarios-container">
      <h2 className="usuarios-titulo">Gestión de Usuarios</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="tabla-container">
        <table className="usuarios-tabla">
          <thead>
            <tr>
              <th className="col-nombre">Nombre</th>
              <th className="col-email">Email</th>
              <th className="col-rol">Rol</th>
              <th className="col-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="col-nombre">{usuario.username || 'N/A'}</td>
                <td className="col-email">{usuario.email}</td>
                <td className="col-rol">{usuario.rol}</td>
                <td className="col-acciones">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => abrirModalEditar(usuario)}
                  >
                    Editar Rol
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && usuarioSeleccionado && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Rol de Usuario</h3>
            <form onSubmit={handleSubmit} className="usuarios-form">
              <p>Usuario: {usuarioSeleccionado.username || usuarioSeleccionado.email}</p>
              <p>Rol actual: {usuarioSeleccionado.rol}</p>
              <select
                value={nuevoRol}
                onChange={(e) => setNuevoRol(e.target.value)}
                className="select-rol"
                required
              >
                <option value="">Seleccionar nuevo rol</option>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
              <div className="form-buttons">
                <button type="submit" className="btn btn-primary">
                  Actualizar Rol
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

export default Usuarios;