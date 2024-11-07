package com.buenSabor.repository;

import com.buenSabor.model.LibroDiario;
import com.google.cloud.firestore.Firestore;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.ExecutionException;


import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;



import java.util.ArrayList;


@Repository
public class LibroDiarioRepository {

    private static final String COLLECTION_NAME = "libroDiario";

    public String guardarLibroDiario(LibroDiario libroDiario) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document();
        libroDiario.setId(documentReference.getId());
        ApiFuture<WriteResult> collectionsApiFuture = documentReference.set(libroDiario);
        collectionsApiFuture.get();
        return libroDiario.getId();
    }

    // Nuevo método para actualizar un LibroDiario existente
    public void actualizarLibroDiario(LibroDiario libroDiario) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference libroRef = dbFirestore.collection(COLLECTION_NAME).document(libroDiario.getId());
        libroRef.set(libroDiario).get();  // Guardar el libro actualizado en Firebase
    }

    // Método para obtener un LibroDiario por su ID
    public LibroDiario obtenerLibroDiario(String id) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(id);  // Obtener referencia al documento
        ApiFuture<DocumentSnapshot> future = documentReference.get();  // Obtener el documento asíncrono
        DocumentSnapshot document = future.get();  // Esperar a que la operación termine

        if (document.exists()) {  // Si el documento existe
            LibroDiario libroDiario = document.toObject(LibroDiario.class);  // Convertirlo a un objeto LibroDiario
            if (libroDiario != null) {
                libroDiario.setId(document.getId());  // Asignar el ID del documento a la entidad
            }
            return libroDiario;
        }
        return null;  // Si el documento no existe, retornar null
    }

    public List<LibroDiario> obtenerTodosLosLibrosDiarios() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = dbFirestore.collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<LibroDiario> librosDiarios = new ArrayList<>();

        for (QueryDocumentSnapshot document : documents) {
            LibroDiario libroDiario = document.toObject(LibroDiario.class);
            libroDiario.setId(document.getId());  // Asignar el ID del documento a la entidad
            librosDiarios.add(libroDiario);
        }

        return librosDiarios;

    }

}