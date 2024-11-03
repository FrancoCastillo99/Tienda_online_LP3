package com.buenSabor.DTO;

import lombok.Data;

import java.util.List;

@Data
public class PreferenciaDTO {
    private List<ItemDTO> items;
    private String idPedido;

    @Data
    public static class ItemDTO {
        private String titulo;
        private double precio;
        private int cantidad;
        private String imagenUrl;
        private String descripcion;
    }
}



