import { useEffect, useState } from "react";
import filtroIcon from "../../../../assets/admin/icons/filtrosIcon.png";
import "./Pedidos.css";
import Modal from "../../components/modal/Modal";
import Boton from "../../components/boton/Boton";

const Pedidos = () => {
    const [isAddModalOpen,setIsAddModalOpen] =useState(false);
    const [isEditModalOpen,setIsEditModalOpen] =useState(false);
    const [isDeleteModalOpen,setIsDeleteModalOpen] =useState(false);
    const [pedidoEdit, setPedidoEdit] = useState(null);
    const [pedidoDelete, setPedidoDelete] = useState(null);
    const [pedidos, setPedidos] = useState([])
    const openAddModal = () => setIsAddModalOpen(true)
    const closeAddModal = () => setIsAddModalOpen(false)
    const openEditModal = (pedido) => {
        setPedidoEdit(pedido)
        setIsEditModalOpen(true)
    }
    const closeEditModal = () => {
        setPedidoEdit(null)
        setIsEditModalOpen(false)
    }
    const openDeleteModal = (pedido) => {
        setPedidoDelete(pedido)
        setIsDeleteModalOpen(true)
    }
    const closeDeleteModal = () => {
        setPedidoDelete(null)
        setIsDeleteModalOpen(false)
    }
    return(
        <div className="content">
            <div className="section-pedidos">
                <div className="container-pedidos">
                    <h2>LISTA DE PEDIDOS</h2>
                    <div className="lista-acciones-pedidos">
                        <Boton onClick={openAddModal} nameClass="btn-agregar" texto="Agregar Pedido"></Boton>
                        <Modal isOpen={isAddModalOpen} onClose={closeAddModal} titulo="Formulario para Agregar Pedido" contenedorClass="contenido-modal" bodyClass="body-modal">
                            <form className="formulario">
                                <Boton type="submit" nameClass="btn-agregar-formulario" texto="Agregar"></Boton>
                            </form>
                        </Modal>
                        <Boton nameClass="btn-filtrar" change={true} img={filtroIcon}></Boton>
                    </div>
                    <table className="tabla-pedidos">
                        <thead>
                            <tr className="informacion-pedidos">
                                <th>Ticket</th>
                                <th>Cliente</th>
                                <th>Productos</th>
                                <th>Total</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map(pedido => (
                                <tr key={pedido.id} className="item-pedido">
                                    <td>{pedido.ticket}</td>
                                    <td>{pedido.cliente}</td>
                                    <td>{pedido.productos}</td>
                                    <td>${pedido.total}</td>
                                    <td>{pedido.tipo}</td>
                                    <td>{pedido.estado}</td>
                                    <td className="acciones-pedido">
                                        <Boton onClick={() => openEditModal(pedido)} nameClass="btn-editar" texto="Editar"></Boton>
                                        <Boton onClick={() => openDeleteModal(pedido)} nameClass="btn-eliminar" texto="Eliminar"></Boton>
                                    </td>
                                </tr>
                            ))}
                                <Modal isOpen={isEditModalOpen} onClose={closeEditModal} titulo="Formulario para Editar Pedido" contenedorClass="contenido-modal" bodyClass="body-modal">
                                    <form className="formulario">
                                        <label>
                                            <span>Nombre</span>
                                            <input type="text" name="nombre" placeholder="Nombre" defaultValue={pedidoEdit?.nombre} required />
                                        </label>

                                        <label>
                                            <span>Descripcion</span>
                                            <textarea name="descripcion" placeholder="Descripcion" defaultValue={pedidoEdit?.descripcion} required />
                                        </label>

                                        <label>
                                            <span>Categoria</span>
                                            <select name="categoria" defaultValue={pedidoEdit?.categoria} required>
                                                <option value="Hamburguesa">Hamburguesa</option>
                                                <option value="Bebida">Bebida</option>
                                                <option value="Papas">Papas</option>
                                            </select>
                                        </label>

                                        <label>
                                            <span>Stock</span>
                                            <input type="number" name="stock" placeholder="Stock" min="1" step="1" defaultValue={pedidoEdit?.stock} required />
                                        </label>

                                        <label>
                                            <span>Precio</span>
                                            <input type="number" name="precio" placeholder="Precio" min="0" step="any" defaultValue={pedidoEdit?.precio} required />
                                        </label>
                                        <Boton type="submit" nameClass="btn-agregar-formulario" texto="Guardar Cambios"></Boton>
                                    </form>
                                </Modal>
                                <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} titulo="Confirmar Eliminación" contenedorClass="contenido-modal-ajustado" bodyClass="body-modal-ajustado">
                                    <p>¿Estás seguro de que deseas eliminar el pedido "{pedidoDelete?.nombre}"?</p>
                                    <div className="acciones-modal">
                                        <Boton nameClass="btn-eliminar" texto="Eliminar"></Boton>
                                        <Boton nameClass="btn-cancelar" texto="Cancelar"></Boton>
                                    </div>
                                </Modal>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="title-section">
                <h1>PEDIDOS</h1>
            </div>
        </div>
    )
}

export default Pedidos;