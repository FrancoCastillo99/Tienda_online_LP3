package com.buenSabor.service;


import com.buenSabor.DTO.PedidoInfoDTO;
import com.buenSabor.model.Pedido;
import com.buenSabor.model.Producto;
import com.buenSabor.model.Usuario;
import com.buenSabor.repository.PedidoRepository;
import com.buenSabor.repository.ProductoRepository;
import com.buenSabor.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public String crearPedido(Pedido pedido) throws ExecutionException, InterruptedException {
        pedido.setFechaPedido(LocalDateTime.now().toString());
        pedido.setEstado("PENDIENTE");
        return pedidoRepository.guardarPedido(pedido);
    }

    public Pedido obtenerPedido(String id) throws ExecutionException, InterruptedException {
        return pedidoRepository.obtenerPedido(id);
    }

    public List<Pedido> obtenerPedidosPorUsuario(String userId) throws ExecutionException, InterruptedException {
        return pedidoRepository.obtenerPedidosPorUsuario(userId);
    }

    public List<Pedido> obtenerTodosLosPedidos() throws ExecutionException, InterruptedException {
        return pedidoRepository.obtenerTodosLosPedidos();
    }

    public String actualizarEstadoPedido(String id, String nuevoEstado) throws ExecutionException, InterruptedException {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("El ID del pedido no puede ser nulo o vacío");
        }
        if (nuevoEstado == null || nuevoEstado.isEmpty()) {
            throw new IllegalArgumentException("El nuevo estado no puede ser nulo o vacío");
        }

        Pedido pedido = pedidoRepository.obtenerPedido(id);
        if (pedido == null) {
            throw new IllegalStateException("No se encontró ningún pedido con el ID: " + id);
        }

        // Validar que el nuevo estado sea válido
        if (!esEstadoValido(nuevoEstado)) {
            throw new IllegalArgumentException("Estado no válido: " + nuevoEstado);
        }

        pedido.setEstado(nuevoEstado);
        String resultado = pedidoRepository.actualizarPedido(pedido);

        if (resultado == null) {
            throw new RuntimeException("Error al actualizar el pedido en la base de datos");
        }

        return resultado;
    }

    private boolean esEstadoValido(String estado) {
        // Definir los estados válidos para un pedido
        return "PENDIENTE".equals(estado) || "PAGADO".equals(estado) || "CANCELADO".equals(estado);
    }

    public List<PedidoInfoDTO> obtenerInfoTodosLosPedidos() throws ExecutionException, InterruptedException {
        List<Pedido> pedidos = pedidoRepository.obtenerTodosLosPedidos();
        return pedidos.stream().map(this::convertirAPedidoInfoDTO).collect(Collectors.toList());
    }

    private PedidoInfoDTO convertirAPedidoInfoDTO(Pedido pedido) {
        PedidoInfoDTO dto = new PedidoInfoDTO();
        dto.setId(pedido.getId());
        dto.setFechaPedido(pedido.getFechaPedido());
        dto.setTotal(pedido.getTotal());
        dto.setEstado(pedido.getEstado());

        // Obtener el username del comprador
        try {
            Usuario usuario = usuarioRepository.obtenerUsuarioPorId(pedido.getUserId());
            dto.setUsernameComprador(usuario != null ? usuario.getUsername() : "Usuario no encontrado");
        } catch (ExecutionException | InterruptedException e) {
            dto.setUsernameComprador("Error al obtener usuario");
            Thread.currentThread().interrupt();  // Restablecer el estado de interrupción
        }

        // Obtener información de los productos usando un método auxiliar para manejar excepciones
        List<PedidoInfoDTO.ProductoPedidoInfo> productosInfo = pedido.getProductos().stream()
                .map(this::convertirAProductoPedidoInfo)
                .collect(Collectors.toList());
        dto.setProductos(productosInfo);

        return dto;
    }

    // Método auxiliar para convertir ProductoPedido y manejar excepciones
    private PedidoInfoDTO.ProductoPedidoInfo convertirAProductoPedidoInfo(Pedido.ProductoPedido productoPedido) {
        PedidoInfoDTO.ProductoPedidoInfo ppi = new PedidoInfoDTO.ProductoPedidoInfo();
        ppi.setCantidad(productoPedido.getCantidad());
        ppi.setPrecioUnitario(productoPedido.getPrecioUnitario());
        ppi.setNombreProducto(productoPedido.getProductoId());

        return ppi;
    }
}

