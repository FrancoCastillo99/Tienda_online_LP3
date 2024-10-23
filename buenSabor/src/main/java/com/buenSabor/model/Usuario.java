package com.buenSabor.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Usuario {
    private String id;
    private String email;
    private String username;
    private String rol;
    private LocalDateTime creada;
}