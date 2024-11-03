package com.buenSabor.Exception;

public class MercadoPagoException extends Exception {
    public MercadoPagoException(String mensaje) {
        super(mensaje);
    }

    public MercadoPagoException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
