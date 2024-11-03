package com.buenSabor.model;

import lombok.Data;
import java.util.List;

@Data
public class Pedido {
    private String id;
    private String userId;
    private List<ProductoPedido> productos;
    private double total;
    private String estado;
    private String fechaPedido;

    @Data
    public static class ProductoPedido {
        private String productoId;
        private int cantidad;
        private double precioUnitario;
    }
}