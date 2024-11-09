package com.buenSabor.service;

import com.buenSabor.DTO.MovimientoDTO;
import com.buenSabor.model.LibroDiario;
import com.buenSabor.model.Producto;
import com.buenSabor.repository.LibroDiarioRepository;
import com.buenSabor.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;


@Service
public class LibroDiarioService {

    @Autowired
    private LibroDiarioRepository libroDiarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public String crearLibroDiario(String nombre) throws ExecutionException, InterruptedException {
        // Crear el nuevo libro diario y asignar el nombre
        LibroDiario nuevoLibro = new LibroDiario();
        nuevoLibro.setNombre(nombre); // Asignar el nombre proporcionado
        nuevoLibro.setIngresos(0);
        nuevoLibro.setGastos(0);
        nuevoLibro.setBalance(0);
        nuevoLibro.setMovimientos(new ArrayList<>());

        // Guardar el libro diario en el repositorio y devolver el ID
        return libroDiarioRepository.guardarLibroDiario(nuevoLibro);
    }

    public LibroDiario obtenerLibro(String id) throws ExecutionException, InterruptedException {
        return libroDiarioRepository.obtenerLibroDiario(id);
    }
    public List<LibroDiario> obtenerTodosLosLibros() throws ExecutionException, InterruptedException {
        return libroDiarioRepository.obtenerTodosLosLibrosDiarios();
    }

    public void agregarMovimiento(String id, MovimientoDTO movimiento) throws ExecutionException, InterruptedException {
        // Obtener el libro diario actual desde el repositorio
        LibroDiario libro = libroDiarioRepository.obtenerLibroDiario(id);

        // Actualizar ingresos o gastos según el tipo de movimiento
        if ("ingreso".equalsIgnoreCase(movimiento.getTipo())) {
            libro.setIngresos(libro.getIngresos() + movimiento.getMonto());
        } else if ("gasto".equalsIgnoreCase(movimiento.getTipo())) {
            libro.setGastos(libro.getGastos() + movimiento.getMonto());
        }

        // Recalcular el balance
        libro.setBalance(libro.getGastos() - libro.getIngresos());

        // Agregar el movimiento al libro
        libro.getMovimientos().add(movimiento);

        // Actualizar el documento en Firebase usando el repositorio
        libroDiarioRepository.actualizarLibroDiario(libro);
    }


}
