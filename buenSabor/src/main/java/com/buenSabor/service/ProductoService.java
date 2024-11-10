package com.buenSabor.service;


import com.buenSabor.model.Producto;
import com.buenSabor.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public String crearProducto(Producto producto) throws ExecutionException, InterruptedException {
        return productoRepository.guardarProducto(producto);
    }

    public Producto obtenerProducto(String id) throws ExecutionException, InterruptedException {
        return productoRepository.obtenerProducto(id);
    }

    public List<Producto> obtenerTodosLosProductos() throws ExecutionException, InterruptedException {
        return productoRepository.obtenerTodosLosProductos();
    }

    public List<Producto> obtenerProductosPorCategoria(String categoria) throws ExecutionException, InterruptedException {
        return productoRepository.obtenerProductosPorCategoria(categoria);
    }

    public String actualizarProducto(Producto producto) throws ExecutionException, InterruptedException {
        return productoRepository.actualizarProducto(producto);
    }

    public String eliminarProducto(String id) throws ExecutionException, InterruptedException {
        return productoRepository.eliminarProducto(id);
    }

    public Map<String, Producto> obtenerMapaProductosPorIds(List<String> ids) throws ExecutionException, InterruptedException {
        return productoRepository.obtenerMapaProductosPorIds(ids);
    }
}
