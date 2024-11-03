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
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;



@Service
public class PagoService {

    @Autowired
    private PedidoService pedidoService;

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
}
