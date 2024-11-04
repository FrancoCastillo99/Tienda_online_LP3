package com.buenSabor.controller;


import com.buenSabor.model.Usuario;
import com.buenSabor.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PutMapping("/{email}/rol")
    public ResponseEntity<String> actualizarRolUsuario(@PathVariable String email, @RequestParam String nuevoRol) throws ExecutionException, InterruptedException {
        try {
            String resultado = usuarioService.actualizarRolUsuario(email, nuevoRol);
            if (resultado != null) {
                return ResponseEntity.ok("Rol actualizado con éxito para el usuario: " + email);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable String email) throws ExecutionException, InterruptedException {
        Usuario usuario = usuarioService.obtenerUsuarioPorEmail(email);
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioId(@PathVariable String id) throws ExecutionException, InterruptedException {
        Usuario usuario = usuarioService.obtenerUsuarioPorId(id);
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodosLosUsuarios() throws ExecutionException, InterruptedException {
        List<Usuario> usuarios = usuarioService.obtenerTodosLosUsuarios();
        return ResponseEntity.ok(usuarios);
    }
}
