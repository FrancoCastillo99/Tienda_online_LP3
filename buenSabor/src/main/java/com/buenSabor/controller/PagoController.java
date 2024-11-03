package com.buenSabor.controller;

import com.buenSabor.DTO.PreferenciaDTO;
import com.buenSabor.Exception.MercadoPagoException;
import com.buenSabor.service.PagoService;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    private static final String PAYMENT_TYPE = "payment";

    @PostMapping("/crear-preferencia")
    public ResponseEntity<Map<String, String>> crearPreferenciaDePago(@RequestBody PreferenciaDTO preferenciaDto) {
        try {
            String preferenceId = pagoService.crearPreferenciaDePago(preferenciaDto);
            Map<String, String> response = new HashMap<>();
            response.put("preferenceId", preferenceId);
            return ResponseEntity.ok(response);
        } catch (MercadoPagoException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al crear preferencia de pago: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> manejarWebhook(
            @RequestParam(value = "data.id", required = false) String pagoId,
            @RequestParam("type") String tipo,
            @RequestBody(required = false) Map<String, Object> webhookData
    ) {
        try {
            if ("payment".equals(tipo)) {
                PaymentClient client = new PaymentClient();
                Payment payment = client.get(Long.parseLong(pagoId));
                String estado = payment.getStatus();
                String externalReference = payment.getExternalReference();

                pagoService.manejarRespuestaDePago(externalReference, estado);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.ok().build(); // Aceptamos otros tipos de notificaciones sin procesarlas
        } catch (MPException | MPApiException | ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

