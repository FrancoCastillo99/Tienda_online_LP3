package com.buenSabor.repository;

import com.buenSabor.model.Usuario;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

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
}
