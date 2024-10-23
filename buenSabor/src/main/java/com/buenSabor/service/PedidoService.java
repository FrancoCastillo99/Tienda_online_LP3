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
        pedido.setFechaPedido(LocalDateTime.now());
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
        Pedido pedido = pedidoRepository.obtenerPedido(id);
        if (pedido != null) {
            pedido.setEstado(nuevoEstado);
            return pedidoRepository.actualizarPedido(pedido);
        }
        return null;
    }
}
