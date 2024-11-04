package com.buenSabor.service;


import com.buenSabor.model.Usuario;
import com.buenSabor.repository.UsuarioRepository;
import org.checkerframework.checker.signedness.qual.UnknownSignedness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public String actualizarRolUsuario(String email, String nuevoRol) throws ExecutionException, InterruptedException {
        if (!nuevoRol.equals("admin") && !nuevoRol.equals("user")) {
            throw new IllegalArgumentException("El rol debe ser 'admin' o 'user'");
        }
        return usuarioRepository.actualizarRolUsuario(email, nuevoRol);
    }

    public Usuario obtenerUsuarioPorEmail(String email) throws ExecutionException, InterruptedException {
        return usuarioRepository.obtenerUsuarioPorEmail(email);
    }

    public Usuario obtenerUsuarioPorId(String id) throws ExecutionException, InterruptedException {
        return usuarioRepository.obtenerUsuarioPorId(id);
    }

    public List<Usuario> obtenerTodosLosUsuarios() throws ExecutionException, InterruptedException {
        return usuarioRepository.obtenerTodosLosUsuarios();
    }
}
