package com.buenSabor.DTO;


import lombok.Data;

import java.util.List;


@Data
public class PedidoUserDTO {
    private String id;
    private String userId;
    private List<ProductoPedidoDTO> productos;
    private double total;
    private String estado;
    private String fechaPedido;

    @Data
    public static class ProductoPedidoDTO {
        private String productoId;
        private String nombreProducto;
        private int cantidad;
        private double precioUnitario;
    }
}
