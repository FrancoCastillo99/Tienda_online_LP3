import "./Usuarios.css";
import filtroIcon from "../../../assets/images/iconos/filtrosIcon.png";
import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { db } from "../../../config/firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import Boton from "../Boton/Boton";

const Usuarios = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioEdit, setUsuarioEdit] = useState(null); // Estado para el  usuario a editar
    const [usuarioDelete, setUsuarioDelete] = useState(null); // Estado para el  usuarios a editar

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const openEditModal = ( usuario) => {
        setUsuarioEdit( usuario); // Guardar el  usuario a editar
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setUsuarioEdit(null); // Limpiar el  usuario al cerrar
        setIsEditModalOpen(false);
    };
    const openDeleteModal = ( usuario) => {
        setUsuarioDelete( usuario); // Guardar el  usuario a editar
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setUsuarioDelete(null); // Limpiar el  usuario al cerrar
        setIsDeleteModalOpen(false);
    };
    // Cargar  usuarios desde Firestore
    useEffect(() => {
        const fetchUsuarios = async () => {
            const  usuariosCollection = collection(db, "usuarios"); // Cambia " usuarios" por el nombre de tu colección
            const  usuariosSnapshot = await getDocs(usuariosCollection);
            const  usuariosList =  usuariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsuarios(usuariosList);
        };

        fetchUsuarios();
    }, []);

    // Manejar el envío del formulario para agregar un  usuario
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const nuevoUsuario = {
            nombre: form.nombre.value,
            descripcion: form.descripcion.value,
            categoria: form.categoria.value,
            stock: parseInt(form.stock.value),
            precio: parseFloat(form.precio.value),
        };

        // Agregar  usuario a Firestore
        const  usuarioRef = await addDoc(collection(db, "usuarios"), nuevoUsuario);
        setUsuarios([... usuarios, { id:  usuarioRef.id, ...nuevoUsuario }]); // Actualizar la lista de  usuarios
        closeAddModal();
    };

    // Manejar el envío del formulario para editar un  usuario
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const  usuarioActualizado = {
            nombre: form.nombre.value,
            descripcion: form.descripcion.value,
            categoria: form.categoria.value,
            stock: parseInt(form.stock.value),
            precio: parseFloat(form.precio.value),
        };

        // Actualizar  usuario en Firestore
        const  usuarioRef = doc(db, "usuarios",  usuarioEdit.id);
        await updateDoc( usuarioRef,  usuarioActualizado);

        // Actualizar la lista de  usuarios localmente
        setUsuarios( usuarios.map(p => (p.id ===  usuarioEdit.id ? { ...p, ... usuarioActualizado } : p)));
        closeEditModal();
    };
    const handleDelete = async (e) => {
        e.preventDefault;

        if ( usuarioDelete) {
            const  usuarioRef = doc(db, " usuarios",  usuarioDelete.id);
            await deleteDoc( usuarioRef);
            setUsuarios( usuarios.filter(p => p.id !==  usuarioDelete.id));
            closeDeleteModal();
        }
    }
    return (
        <div className="content">
            <div className="section-usuarios">
                <div className="container-usuarios">
                    <h2>LISTA DE USUARIOS</h2>
                    <div className="lista-acciones-usuario">
                        <Boton onClick={openAddModal} nameClass="btn-agregar" texto="Agregar Usuario"></Boton>
                        <Modal isOpen={isAddModalOpen} onClose={closeAddModal} titulo="Formulario para Agregar usuario" contenedorClass="contenido-modal-mediano" bodyClass="body-modal">
                            <form className="formulario" onSubmit={handleAddSubmit}>
                                <label>
                                    <span>Username</span>
                                    <input type="text" name="nombre" placeholder="Nombre" required />
                                </label>

                                <label>
                                    <span>Correo</span>
                                    <input type="email" name="email" placeholder="Correo" required />
                                </label>

                                <label>
                                    <span>Contraseña</span>
                                    <input type="password" name="password" placeholder="Contraseña" required />
                                </label>

                                <label>
                                    <span>Rol</span>
                                    <input type="text" name="rol" placeholder="Rol" required />
                                </label>
                                <Boton type="submit" nameClass="btn-agregar-formulario" texto="Agregar"></Boton>
                            </form>
                        </Modal>
                        <Boton nameClass="btn-filtrar" change={true} img={filtroIcon}></Boton>
                    </div>
                    <table className="tabla-usuarios">
                        <thead>
                            <tr className="informacion-usuarios">
                                <th>Username</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(usuario => (
                                <tr key={usuario.id} className="item-usuario">
                                    <td>{usuario.username}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.rol}</td>
                                    <td>
                                        <Boton onClick={() => openEditModal(usuario)} nameClass="btn-editar" texto="Editar"></Boton>
                                        <Boton onClick={() => openEditModal(usuario)} nameClass="btn-eliminar" texto="Eliminar"></Boton>
                                    </td>
                                </tr>
                            ))}
                                <Modal isOpen={isEditModalOpen} onClose={closeEditModal} titulo="Formulario para Editar  usuario" contenedorClass="contenido-modal" bodyClass="body-modal">
                                    <form className="formulario" onSubmit={handleEditSubmit}>
                                        <label>
                                            <span>Username</span>
                                            <input type="text" name="username" placeholder="Username" defaultValue={ usuarioEdit?.username} required />
                                        </label>

                                        <label>
                                            <span>Correo</span>
                                            <textarea name="correo" placeholder="Correo" defaultValue={ usuarioEdit?.email} required />
                                        </label>

                                        <label>
                                            <span>Contraseña</span>
                                            <input name="contraseña" defaultValue={ usuarioEdit?.password} required />
                                        </label>

                                        <label>
                                            <span>Rol</span>
                                            <input type="text" name="rol" placeholder="Rol" defaultValue={ usuarioEdit?.rol} required />
                                        </label>
                                        <Boton type="submit" nameClass="btn-agregar-formulario" texto="Guardar Cambios"></Boton>
                                    </form>
                                </Modal>
                                <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} titulo="Confirmar Eliminación" contenedorClass="contenido-modal-ajustado" bodyClass="body-modal-ajustado">
                                    <p>¿Estás seguro de que deseas eliminar el usuario "{ usuarioDelete?.username}"?</p>
                                    <div className="acciones-modal">
                                        <Boton onClick={handleDelete} nameClass="btn-eliminar" texto="Eliminar"></Boton>
                                        <Boton onClick={closeDeleteModal} nameClass="btn-cancelar" texto="Cancelar"></Boton>
                                    </div>
                                </Modal>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="title-section">
                <h1>USUARIOS</h1>
            </div>
        </div>
    );
};

export default Usuarios;
