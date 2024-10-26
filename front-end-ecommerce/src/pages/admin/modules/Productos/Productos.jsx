import "./Productos.css";
import filtroIcon from "../../../../assets/admin/icons/filtrosIcon.png";
import { useState, useEffect } from "react";
import Modal from "../../components/modal/Modal";
import { db } from "../../../../config/firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import Boton from "../../components/boton/Boton";

const Productos = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productos, setProductos] = useState(() => {
        // Intenta obtener productos cacheados del localStorage
        const savedProducts = localStorage.getItem("productos");
        return savedProducts ? JSON.parse(savedProducts) : [];
    });
    const [productoEdit, setProductoEdit] = useState(null);
    const [productoDelete, setProductoDelete] = useState(null);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);
    const openEditModal = (producto) => {
        setProductoEdit(producto);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setProductoEdit(null);
        setIsEditModalOpen(false);
    };
    const openDeleteModal = (producto) => {
        setProductoDelete(producto);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setProductoDelete(null);
        setIsDeleteModalOpen(false);
    };

    // Cargar productos desde Firestore si el estado de productos está vacío
    useEffect(() => {
        const fetchProductos = async () => {
            const productosCollection = collection(db, "productos");
            const productosSnapshot = await getDocs(productosCollection);
            const productosList = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProductos(productosList);
            // Guardar productos en localStorage
            localStorage.setItem("productos", JSON.stringify(productosList));
        };

        // Solo cargar si no hay productos en el estado
        if (productos.length === 0) {
            fetchProductos();
        }
    }, [productos]);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const nuevoProducto = {
            nombre: form.nombre.value,
            descripcion: form.descripcion.value,
            categoria: form.categoria.value,
            stock: parseInt(form.stock.value),
            precio: parseFloat(form.precio.value),
        };

        const productoRef = await addDoc(collection(db, "productos"), nuevoProducto);
        const nuevosProductos = [...productos, { id: productoRef.id, ...nuevoProducto }];
        setProductos(nuevosProductos);
        localStorage.setItem("productos", JSON.stringify(nuevosProductos)); // Actualiza el cache
        closeAddModal();
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const productoActualizado = {
            nombre: form.nombre.value,
            descripcion: form.descripcion.value,
            categoria: form.categoria.value,
            stock: parseInt(form.stock.value),
            precio: parseFloat(form.precio.value),
        };

        const productoRef = doc(db, "productos", productoEdit.id);
        await updateDoc(productoRef, productoActualizado);

        const nuevosProductos = productos.map(p => (p.id === productoEdit.id ? { ...p, ...productoActualizado } : p));
        setProductos(nuevosProductos);
        localStorage.setItem("productos", JSON.stringify(nuevosProductos)); // Actualiza el cache
        closeEditModal();
    };

    const handleDelete = async () => {
        if (productoDelete) {
            const productoRef = doc(db, "productos", productoDelete.id);
            await deleteDoc(productoRef);
            const nuevosProductos = productos.filter(p => p.id !== productoDelete.id);
            setProductos(nuevosProductos);
            localStorage.setItem("productos", JSON.stringify(nuevosProductos)); // Actualiza el cache
            closeDeleteModal();
        }
    };
    return (
        <div className="content">
            <div className="section-productos">
                <div className="container-productos">
                    <h2>LISTA DE PRODUCTOS</h2>
                    <div className="lista-acciones-productos">
                        <Boton onClick={openAddModal} nameClass="btn-agregar" texto="Agregar Producto"></Boton>
                        <Modal isOpen={isAddModalOpen} onClose={closeAddModal} titulo="Formulario para Agregar Producto" contenedorClass="contenido-modal" bodyClass="body-modal">
                            <form className="formulario" onSubmit={handleAddSubmit}>
                                <label>
                                    <span>Nombre</span>
                                    <input type="text" name="nombre" placeholder="Nombre" required />
                                </label>

                                <label>
                                    <span>Descripcion</span>
                                    <textarea name="descripcion" placeholder="Descripcion" required />
                                </label>

                                <label>
                                    <span>Categoria</span>
                                    <select name="categoria" required>
                                        <option value="" disabled selected>Selecciona una categoría</option>
                                        <option value="Hamburguesa">Hamburguesa</option>
                                        <option value="Bebida">Bebida</option>
                                        <option value="Papas">Papas</option>
                                    </select>
                                </label>

                                <label>
                                    <span>Stock</span>
                                    <input type="number" name="stock" min="1" step="1" required />
                                </label>

                                <label>
                                    <span>Precio</span>
                                    <input type="number" name="precio" min="0" step="any" required />
                                </label>
                                <Boton type="submit" nameClass="btn-agregar-formulario" texto="Agregar"></Boton>
                            </form>
                        </Modal>
                        <Boton nameClass="btn-filtrar" change={true} img={filtroIcon}></Boton>
                    </div>
                    <table className="tabla-productos">
                        <thead>
                            <tr className="informacion-productos">
                                <th>Nombre</th>
                                <th>Descripcion</th>
                                <th>Categoria</th>
                                <th>Stock</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map(producto => (
                                <tr key={producto.id} className="item-producto">
                                    <td>{producto.nombre}</td>
                                    <td>{producto.descripcion}</td>
                                    <td>{producto.categoria}</td>
                                    <td>{producto.stock}</td>
                                    <td>${producto.precio}</td>
                                    <td className="acciones-producto">
                                        <Boton onClick={() => openEditModal(producto)} nameClass="btn-editar" texto="Editar"></Boton>
                                        <Boton onClick={() => openDeleteModal(producto)} nameClass="btn-eliminar" texto="Eliminar"></Boton>
                                    </td>
                                </tr>
                            ))}
                                <Modal isOpen={isEditModalOpen} onClose={closeEditModal} titulo="Formulario para Editar Producto" contenedorClass="contenido-modal" bodyClass="body-modal">
                                    <form className="formulario" onSubmit={handleEditSubmit}>
                                        <label>
                                            <span>Nombre</span>
                                            <input type="text" name="nombre" placeholder="Nombre" defaultValue={productoEdit?.nombre} required />
                                        </label>

                                        <label>
                                            <span>Descripcion</span>
                                            <textarea name="descripcion" placeholder="Descripcion" defaultValue={productoEdit?.descripcion} required />
                                        </label>

                                        <label>
                                            <span>Categoria</span>
                                            <select name="categoria" defaultValue={productoEdit?.categoria} required>
                                                <option value="Hamburguesa">Hamburguesa</option>
                                                <option value="Bebida">Bebida</option>
                                                <option value="Papas">Papas</option>
                                            </select>
                                        </label>

                                        <label>
                                            <span>Stock</span>
                                            <input type="number" name="stock" placeholder="Stock" min="1" step="1" defaultValue={productoEdit?.stock} required />
                                        </label>

                                        <label>
                                            <span>Precio</span>
                                            <input type="number" name="precio" placeholder="Precio" min="0" step="any" defaultValue={productoEdit?.precio} required />
                                        </label>
                                        <Boton type="submit" nameClass="btn-agregar-formulario" texto="Guardar Cambios"></Boton>
                                    </form>
                                </Modal>
                                <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} titulo="Confirmar Eliminación" contenedorClass="contenido-modal-ajustado" bodyClass="body-modal-ajustado">
                                    <p>¿Estás seguro de que deseas eliminar el producto "{productoDelete?.nombre}"?</p>
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
                <h1>PRODUCTOS</h1>
            </div>
        </div>
    );
};

export default Productos;
