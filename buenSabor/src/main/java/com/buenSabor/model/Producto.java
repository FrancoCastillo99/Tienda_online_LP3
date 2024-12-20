package com.buenSabor.model;

import lombok.Data;

@Data
public class Producto {
    private String id;
    private String nombre;
    private double precio;
    private double costo;
    private String descripcion;
    private String imagenUrl;
    private String categoria;  // "HAMBURGUESA", "ACOMPANAMIENTO", "BEBIDA", etc.
    private int stock;
}
