package com.buenSabor.controller;


import com.buenSabor.model.Producto;
import com.buenSabor.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @PostMapping
    public ResponseEntity<String> crearProducto(@RequestBody Producto producto) throws ExecutionException, InterruptedException {
        return new ResponseEntity<>(productoService.crearProducto(producto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable String id) throws ExecutionException, InterruptedException {
        Producto producto = productoService.obtenerProducto(id);
        return producto != null ? ResponseEntity.ok(producto) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Producto>> obtenerTodosLosProductos() throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(productoService.obtenerTodosLosProductos());
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Producto>> obtenerProductosPorCategoria(@PathVariable String categoria) throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(productoService.obtenerProductosPorCategoria(categoria));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> actualizarProducto(@PathVariable String id, @RequestBody Producto producto) throws ExecutionException, InterruptedException {
        producto.setId(id);
        return ResponseEntity.ok(productoService.actualizarProducto(producto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarProducto(@PathVariable String id) throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(productoService.eliminarProducto(id));
    }
}
