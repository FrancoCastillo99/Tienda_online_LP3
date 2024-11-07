package com.buenSabor.DTO;

import com.buenSabor.model.LibroDiario;
import lombok.Data;

@Data
public  class MovimientoDTO {
    private String concepto;
    private double monto;
    private String tipo;
}
