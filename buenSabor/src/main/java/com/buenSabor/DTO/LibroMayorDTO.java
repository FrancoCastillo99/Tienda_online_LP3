package com.buenSabor.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LibroMayorDTO {
    private double ingresosTotales;
    private double pagosTotales;
    private double balanceTotal;

}
