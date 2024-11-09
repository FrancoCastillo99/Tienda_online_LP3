package com.buenSabor.model;

import com.buenSabor.DTO.MovimientoDTO;
import lombok.Data;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
public class LibroDiario {
    private String id;
    private String nombre;
    private double ingresos;
    private double gastos;
    private double balance;
    private List<MovimientoDTO> movimientos;


}
