package com.buenSabor.DTO;

import lombok.Data;

import java.util.List;

@Data
public class PedidoInfoDTO {
    private String id;
    private String fechaPedido;
    private String usernameComprador;
    private List<ProductoPedidoInfo> productos;
    private double total;
    private String estado;

    @Data
    public static class ProductoPedidoInfo {
        private String nombreProducto;
        private int cantidad;
        private double precioUnitario;
    }
}
