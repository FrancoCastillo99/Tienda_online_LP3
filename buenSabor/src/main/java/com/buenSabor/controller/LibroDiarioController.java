package com.buenSabor.controller;

import com.buenSabor.DTO.MovimientoDTO;
import com.buenSabor.DTO.ReposicionStockDTO;
import com.buenSabor.model.LibroDiario;
import com.buenSabor.model.Producto;
import com.buenSabor.service.LibroDiarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/libro")
public class LibroDiarioController {

    @Autowired
    private LibroDiarioService libroDiarioService;


    @PostMapping("/crear")
    public ResponseEntity<Map<String, String>> crearLibroDiario() throws ExecutionException, InterruptedException {

        // Crear el libro diario con la fecha actual
        String id = libroDiarioService.crearLibroDiario();

        // Preparar la respuesta
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "LibroDiario creado exitosamente");
        response.put("id", id);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/{id}")
    public ResponseEntity<LibroDiario> obtenerProducto(@PathVariable String id) throws ExecutionException, InterruptedException {
        LibroDiario libro = libroDiarioService.obtenerLibro(id);
        return libro != null ? ResponseEntity.ok(libro) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<LibroDiario>> obtenerTodosLosLibros() throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(libroDiarioService.obtenerTodosLosLibros());
    }

    @PutMapping("/actualizar/{id}/movimiento")
    public ResponseEntity<Map<String, String>> agregarMovimiento(
            @PathVariable String id,
            @RequestBody MovimientoDTO movimientoDTO) throws ExecutionException, InterruptedException {

        libroDiarioService.agregarMovimiento(id, movimientoDTO);
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Movimiento agregado exitosamente y valores actualizados");
        return ResponseEntity.ok(response);
    }
}