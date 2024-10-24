package com.buenSabor.controller;


import com.buenSabor.model.Pedido;
import com.buenSabor.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<String> crearPedido(@RequestBody Pedido pedido) throws ExecutionException, InterruptedException {
        return new ResponseEntity<>(pedidoService.crearPedido(pedido), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedido(@PathVariable String id) throws ExecutionException, InterruptedException {
        Pedido pedido = pedidoService.obtenerPedido(id);
        return pedido != null ? ResponseEntity.ok(pedido) : ResponseEntity.notFound().build();
    }

    @GetMapping("/usuario/{userId}")
    public ResponseEntity<List<Pedido>> obtenerPedidosPorUsuario(@PathVariable String userId) throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(pedidoService.obtenerPedidosPorUsuario(userId));
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> obtenerTodosLosPedidos() throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(pedidoService.obtenerTodosLosPedidos());
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<String> actualizarEstadoPedido(@PathVariable String id, @RequestParam String nuevoEstado) throws ExecutionException, InterruptedException {
        String resultado = pedidoService.actualizarEstadoPedido(id, nuevoEstado);
        return resultado != null ? ResponseEntity.ok(resultado) : ResponseEntity.notFound().build();
    }
}
