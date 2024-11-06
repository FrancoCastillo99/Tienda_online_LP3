package com.buenSabor.controller;

import com.buenSabor.DTO.PreferenciaDTO;
import com.buenSabor.Exception.MercadoPagoException;
import com.buenSabor.service.PagoService;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.resources.payment.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



import java.util.HashMap;
import java.util.Map;

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
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Signature", required = false) String xSignatureHeader,
            @RequestHeader(value = "x-request-id", required = false) String requestId) {

        try {
            // Parsear el payload
            JsonObject jsonPayload = JsonParser.parseString(payload).getAsJsonObject();

            // Verificar que sea una notificación de tipo payment
            if (!"payment".equals(jsonPayload.get("type").getAsString())) {
                return ResponseEntity.ok("Notification type not handled");
            }

            // Obtener el ID del pago
            String paymentId = jsonPayload.get("data").getAsJsonObject().get("id").getAsString();

            // Validar la firma del webhook
            if (!pagoService.isValidSignature(xSignatureHeader, requestId, paymentId)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid signature");
            }

            // Obtener los detalles del pago desde MercadoPago
            PaymentClient client = new PaymentClient();

            // Obtener los detalles del pago
            Payment payment = client.get(Long.parseLong(paymentId));

            // Obtener el ID del pedido desde external_reference
            String idPedido = payment.getExternalReference();

            // Obtener el estado del pago
            String estado = payment.getStatus();

            // Actualizar el estado en Firebase
            pagoService.manejarRespuestaDePago(idPedido, estado);

            return ResponseEntity.ok("Webhook processed successfully");

        } catch (MPApiException e) {
            System.err.println("MPApiException: " + e.getMessage());
            System.err.println("Causa: " + e.getCause());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener el pago: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Se produjo un error inesperado: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }
}


