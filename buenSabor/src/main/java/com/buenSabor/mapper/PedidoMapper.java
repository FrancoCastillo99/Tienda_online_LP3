package com.buenSabor.mapper;

import com.buenSabor.DTO.PedidoUserDTO;
import com.buenSabor.model.Pedido;
import com.buenSabor.model.Producto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class PedidoMapper {

    public PedidoUserDTO toDTO(Pedido pedido, Map<String, Producto> productosMap) {
        if (pedido == null) {
            return null;
        }

        PedidoUserDTO dto = new PedidoUserDTO();
        dto.setId(pedido.getId());
        dto.setUserId(pedido.getUserId());
        dto.setTotal(pedido.getTotal());
        dto.setEstado(pedido.getEstado());
        dto.setFechaPedido(pedido.getFechaPedido());
        dto.setProductos(mapProductos(pedido.getProductos(), productosMap));

        return dto;
    }

    private List<PedidoUserDTO.ProductoPedidoDTO> mapProductos(List<Pedido.ProductoPedido> productos,
                                                           Map<String, Producto> productosMap) {
        if (productos == null) {
            return new ArrayList<>();
        }

        return productos.stream()
                .map(producto -> mapProductoPedido(producto, productosMap))
                .collect(Collectors.toList());
    }

    private PedidoUserDTO.ProductoPedidoDTO mapProductoPedido(Pedido.ProductoPedido producto,
                                                          Map<String, Producto> productosMap) {
        PedidoUserDTO.ProductoPedidoDTO dto = new PedidoUserDTO.ProductoPedidoDTO();
        dto.setProductoId(producto.getProductoId());
        dto.setCantidad(producto.getCantidad());
        dto.setPrecioUnitario(producto.getPrecioUnitario());

        Producto productoInfo = productosMap.get(producto.getProductoId());
        if (productoInfo != null) {
            dto.setNombreProducto(productoInfo.getNombre());
        }

        return dto;
    }

    public List<PedidoUserDTO> toDTOList(List<Pedido> pedidos, Map<String, Producto> productosMap) {
        if (pedidos == null) {
            return new ArrayList<>();
        }

        return pedidos.stream()
                .map(pedido -> toDTO(pedido, productosMap))
                .collect(Collectors.toList());
    }
}
