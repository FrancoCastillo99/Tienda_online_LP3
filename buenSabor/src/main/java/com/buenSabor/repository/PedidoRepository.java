package com.buenSabor.repository;

import com.buenSabor.model.Pedido;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class PedidoRepository {

    private static final String COLLECTION_NAME = "pedidos";

    public String guardarPedido(Pedido pedido) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference docRef = dbFirestore.collection(COLLECTION_NAME).document();
        pedido.setId(docRef.getId());
        ApiFuture<WriteResult> collectionsApiFuture = docRef.set(pedido);
        collectionsApiFuture.get();
        return pedido.getId();
    }

    public Pedido obtenerPedido(String id) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        if(document.exists()) {
            return document.toObject(Pedido.class);
        }
        return null;
    }

    public List<Pedido> obtenerPedidosPorUsuario(String userId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = dbFirestore.collection(COLLECTION_NAME)
                .whereEqualTo("userId", userId)
                .get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<Pedido> pedidos = new ArrayList<>();
        for (QueryDocumentSnapshot document : documents) {
            pedidos.add(document.toObject(Pedido.class));
        }
        return pedidos;
    }

    public List<Pedido> obtenerTodosLosPedidos() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = dbFirestore.collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<Pedido> pedidos = new ArrayList<>();
        for (QueryDocumentSnapshot document : documents) {
            pedidos.add(document.toObject(Pedido.class));
        }
        return pedidos;
    }

    public String actualizarPedido(Pedido pedido) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection(COLLECTION_NAME).document(pedido.getId()).set(pedido);
        return collectionsApiFuture.get().getUpdateTime().toString();
    }
}
