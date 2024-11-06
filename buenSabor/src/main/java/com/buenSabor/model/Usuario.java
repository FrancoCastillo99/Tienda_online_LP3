package com.buenSabor.model;

import com.google.cloud.Timestamp;
import lombok.Data;

import java.beans.Transient;
import java.time.LocalDateTime;

@Data
public class Usuario {
    private String id;
    private String email;
    private String username;
    private Timestamp loginConGoogle;
    private String rol;
    private Timestamp creada;
}