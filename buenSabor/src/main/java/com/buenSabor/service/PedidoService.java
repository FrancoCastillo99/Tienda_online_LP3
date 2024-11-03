package com.buenSabor.service;


import com.buenSabor.model.Pedido;
import com.buenSabor.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

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
}
