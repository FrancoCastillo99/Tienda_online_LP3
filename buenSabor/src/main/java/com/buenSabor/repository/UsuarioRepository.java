package com.buenSabor.repository;

import com.buenSabor.model.Usuario;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class UsuarioRepository {

    private static final String COLLECTION_NAME = "usuarios";

    public Usuario obtenerUsuarioPorEmail(String email) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = dbFirestore.collection(COLLECTION_NAME)
                .whereEqualTo("email", email)
                .get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        if (!documents.isEmpty()) {
            Usuario usuario = documents.get(0).toObject(Usuario.class);
            usuario.setId(documents.get(0).getId());
            return usuario;
        }
        return null;
    }

    public Usuario obtenerUsuarioPorId(String id) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        // Obtener el documento por ID directamente
        DocumentReference docRef = dbFirestore.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        // Verificar si el documento existe
        if (document.exists()) {
            Usuario usuario = document.toObject(Usuario.class);
            usuario.setId(document.getId()); // Configurar el ID en el objeto Usuario
            return usuario;
        }
        return null; // Retornar null si no se encuentra el documento
    }

    public String actualizarRolUsuario(String email, String nuevoRol) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = dbFirestore.collection(COLLECTION_NAME)
                .whereEqualTo("email", email)
                .get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        if (!documents.isEmpty()) {
            String docId = documents.get(0).getId();
            ApiFuture<WriteResult> writeResult = dbFirestore.collection(COLLECTION_NAME).document(docId)
                    .update("rol", nuevoRol);
            return writeResult.get().getUpdateTime().toString();
        }
        return null;
    }

    public List<Usuario> obtenerTodosLosUsuarios() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = dbFirestore.collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<Usuario> usuarios = new ArrayList<>();
        for (QueryDocumentSnapshot document : documents) {
            Usuario usuario = convertirDocumentoAUsuario(document);
            usuarios.add(usuario);
        }
        return usuarios;
    }
    private Usuario convertirDocumentoAUsuario(DocumentSnapshot document) {
        Usuario usuario = new Usuario();
        usuario.setId(document.getId());
        usuario.setEmail(document.getString("email"));
        usuario.setUsername(document.getString("username"));
        usuario.setRol(document.getString("rol"));

        // Convertir Timestamp a LocalDateTime
        Timestamp timestamp = document.getTimestamp("creada");
        if (timestamp != null) {
            usuario.setCreada(timestamp);
        }

        return usuario;
    }
}
