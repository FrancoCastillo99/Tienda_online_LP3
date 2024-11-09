package com.buenSabor.controller;

import com.buenSabor.DTO.LibroMayorDTO;
import com.buenSabor.DTO.MovimientoDTO;
import com.buenSabor.DTO.ReposicionStockDTO;
import com.buenSabor.model.LibroDiario;
import com.buenSabor.model.Producto;
import com.buenSabor.service.LibroDiarioService;
import com.google.cloud.Timestamp;
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
    public ResponseEntity<Map<String, String>> crearLibroDiario(@RequestBody Map<String, String> requestBody) throws ExecutionException, InterruptedException {
        // Obtener el nombre del libro desde el cuerpo de la solicitud
        String nombre = requestBody.get("nombre");

        // Crear el libro diario con la fecha actual y el nombre proporcionado
        String id = libroDiarioService.crearLibroDiario(nombre);

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

        // Asignar la fecha actual al campo `fecha` del movimiento
        movimientoDTO.setFecha(Timestamp.now());

        // Llamar al servicio para procesar el movimiento
        libroDiarioService.agregarMovimiento(id, movimientoDTO);

        // Preparar la respuesta de éxito
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Movimiento agregado exitosamente y valores actualizados");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/libroMayor")
    public ResponseEntity<LibroMayorDTO> obtenerLibroMayor() throws ExecutionException, InterruptedException {
        // Obtén todos los libros diarios y suma los valores de ingresos, pagos y balance
        List<LibroDiario> librosDiarios = libroDiarioService.obtenerTodosLosLibros();
        double totalIngresos = librosDiarios.stream().mapToDouble(LibroDiario::getIngresos).sum();
        double totalPagos = librosDiarios.stream().mapToDouble(LibroDiario::getGastos).sum();
        double balanceTotal = librosDiarios.stream().mapToDouble(LibroDiario::getBalance).sum();

        // Crea el objeto LibroMayorDTO con los valores calculados
        LibroMayorDTO libroMayor = new LibroMayorDTO(totalIngresos, totalPagos, balanceTotal);
        return ResponseEntity.ok(libroMayor);
    }

}