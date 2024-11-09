package com.buenSabor.DTO;

import com.buenSabor.model.LibroDiario;
import com.google.cloud.Timestamp;
import lombok.Data;

@Data
public  class MovimientoDTO {
    private String concepto;
    private Timestamp fecha;
    private double monto;
    private String tipo;
}
