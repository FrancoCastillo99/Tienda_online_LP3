package com.buenSabor.controller;


import com.buenSabor.DTO.PedidoInfoDTO;
import com.buenSabor.DTO.PedidoUserDTO;
import com.buenSabor.mapper.PedidoMapper;
import com.buenSabor.model.Pedido;
import com.buenSabor.model.Producto;
import com.buenSabor.service.PedidoService;
import com.buenSabor.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private ProductoService productoService;

    @Autowired
    private PedidoMapper pedidoMapper;

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

    @GetMapping("/info")
    public ResponseEntity<List<PedidoInfoDTO>> obtenerInfoTodosLosPedidos() throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(pedidoService.obtenerInfoTodosLosPedidos());
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<String> actualizarEstadoPedido(@PathVariable String id, @RequestParam String nuevoEstado) throws ExecutionException, InterruptedException {
        String resultado = pedidoService.actualizarEstadoPedido(id, nuevoEstado);
        return resultado != null ? ResponseEntity.ok(resultado) : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/estado")
    public ResponseEntity<String> obtenerEstadoPedido(@PathVariable String id) {
        try {
            Pedido pedido = pedidoService.obtenerPedido(id);
            if (pedido != null) {
                return ResponseEntity.ok(pedido.getEstado());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener el estado del pedido");
        }
    }

    @GetMapping("/usuario/{userId}/completo")
    public ResponseEntity<List<PedidoUserDTO>> obtenerPedidosCompletoPorUsuario(@PathVariable String userId)
            throws ExecutionException, InterruptedException {
        // Obtener pedidos
        List<Pedido> pedidos = pedidoService.obtenerPedidosPorUsuario(userId);

        // Recolectar todos los IDs de productos únicos
        List<String> productosIds = pedidos.stream()
                .flatMap(pedido -> pedido.getProductos().stream())
                .map(Pedido.ProductoPedido::getProductoId)
                .distinct()
                .collect(Collectors.toList());

        // Obtener todos los productos en una sola consulta
        Map<String, Producto> productosMap = productoService.obtenerMapaProductosPorIds(productosIds);

        // Convertir pedidos a DTOs usando el mapper
        List<PedidoUserDTO> pedidosDTO = pedidoMapper.toDTOList(pedidos, productosMap);

        return ResponseEntity.ok(pedidosDTO);
    }

}
