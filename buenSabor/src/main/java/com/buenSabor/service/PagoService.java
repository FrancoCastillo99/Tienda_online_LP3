package com.buenSabor.service;

import com.buenSabor.DTO.PreferenciaDTO;
import com.buenSabor.Exception.MercadoPagoException;
import com.buenSabor.model.Pedido;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;



@Service
public class PagoService {

    @Autowired
    private PedidoService pedidoService;

    @Value("${mercadopago.webhook.secret}")
    private String webhookSecret;


    public String crearPreferenciaDePago(PreferenciaDTO preferenciaDto) throws MercadoPagoException {
        try {
            // Convertir cada ItemDTO a un PreferenceItemRequest
            List<PreferenceItemRequest> items = preferenciaDto.getItems().stream()
                    .map(itemDto -> PreferenceItemRequest.builder()
                            .title(itemDto.getTitulo())
                            .quantity(itemDto.getCantidad())
                            .currencyId("ARS")
                            .unitPrice(BigDecimal.valueOf(itemDto.getPrecio()))
                            .description(itemDto.getDescripcion())
                            .pictureUrl(itemDto.getImagenUrl())
                            .build())
                    .collect(Collectors.toList());

            // Crear el objeto PreferenceBackUrlsRequest
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("http://localhost:5174/home") // URL de éxito
                    .pending("http://localhost:5174/home") // URL de pendiente
                    .failure("http://localhost:5174/home") // URL de fallo
                    .build();

            // Crear la solicitud de preferencia
            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(backUrls) // Usar el objeto backUrls aquí
                    .externalReference(preferenciaDto.getIdPedido()) // Referencia externa
                    .notificationUrl("https://6425-2803-9800-9843-7d4e-390f-bbb0-c869-8b2f.ngrok-free.app/api/pagos/webhook")
                    .build();

            // Crear la preferencia usando el cliente
            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            return preference.getId(); // Retorna el ID de la preferencia creada
        } catch (MPException | MPApiException e) {
            throw new MercadoPagoException("Error al crear preferencia de pago", e);
        }
    }


    // Método personalizado para manejar la respuesta de pago
    public void manejarRespuestaDePago(String idPedido, String estado) throws ExecutionException, InterruptedException {
        Pedido pedido = pedidoService.obtenerPedido(idPedido);

        if (pedido != null) {
            switch (estado) {
                case "approved":
                    pedido.setEstado("PAGADO");
                    break;
                case "pending":
                    pedido.setEstado("PENDIENTE_PAGO");
                    break;
                case "failure":
                    pedido.setEstado("PAGO_FALLIDO");
                    break;
            }

            pedidoService.actualizarEstadoPedido(pedido.getId(), pedido.getEstado());
        }
    }

    public boolean isValidSignature(String xSignature, String xRequestId, String dataID) {
        if (xSignature == null || webhookSecret == null) {
            System.out.println("Header o clave secreta vacíos");
            return false;
        }

        // Separar los valores ts y v1 del x-signature
        String timestamp = null;
        String hash = null;
        String[] parts = xSignature.split(",");

        for (String part : parts) {
            String[] keyValue = part.split("=", 2);
            if (keyValue.length == 2) {
                String key = keyValue[0].trim();
                String value = keyValue[1].trim();
                if ("ts".equals(key)) {
                    timestamp = value;
                } else if ("v1".equals(key)) {
                    hash = value;
                }
            }
        }

        if (timestamp == null || hash == null) {
            System.out.println("Timestamp o hash no encontrados en el header");
            return false;
        }

        // Construir el template o manifest string
        String manifest = "id:" + dataID + ";request-id:" + xRequestId + ";ts:" + timestamp + ";";
        System.out.println("Manifest: " + manifest);

        // Crear la firma HMAC-SHA256
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] signedBytes = mac.doFinal(manifest.getBytes(StandardCharsets.UTF_8));

            // Convertir la firma a formato hexadecimal
            StringBuilder generatedSignature = new StringBuilder();
            for (byte b : signedBytes) {
                generatedSignature.append(String.format("%02x", b));
            }

            System.out.println("Firma generada: " + generatedSignature);
            System.out.println("Firma recibida (v1): " + hash);

            // Comparar la firma generada con la firma recibida
            return generatedSignature.toString().equals(hash);

        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            e.printStackTrace();
            return false;
        }
    }

}
