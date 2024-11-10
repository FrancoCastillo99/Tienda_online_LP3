package com.buenSabor.repository;

import com.buenSabor.model.Producto;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Repository
public class ProductoRepository {

    private static final String COLLECTION_NAME = "productos";

    public List<Producto> obtenerProductosPorIds(List<String> ids) throws ExecutionException, InterruptedException {
        if (ids == null || ids.isEmpty()) {
            return new ArrayList<>();
        }

        Firestore dbFirestore = FirestoreClient.getFirestore();
        List<Producto> productos = new ArrayList<>();

        // Firestore tiene un límite de 10 documentos por consulta in
        List<List<String>> batchedIds = new ArrayList<>();
        for (int i = 0; i < ids.size(); i += 10) {
            batchedIds.add(ids.subList(i, Math.min(i + 10, ids.size())));
        }

        for (List<String> batch : batchedIds) {
            ApiFuture<QuerySnapshot> future = dbFirestore.collection(COLLECTION_NAME)
                    .whereIn(FieldPath.documentId(), batch)
                    .get();

            List<QueryDocumentSnapshot> documents = future.get().getDocuments();
            for (QueryDocumentSnapshot document : documents) {
                Producto producto = document.toObject(Producto.class);
                producto.setId(document.getId());
                productos.add(producto);
            }
        }

        return productos;
    }

    // Método para obtener un Map de ID -> Producto para búsqueda rápida
    public Map<String, Producto> obtenerMapaProductosPorIds(List<String> ids) throws ExecutionException, InterruptedException {
        return obtenerProductosPorIds(ids).stream()
                .collect(Collectors.toMap(Producto::getId, producto -> producto));
    }

    public String guardarProducto(Producto producto) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference docRef = dbFirestore.collection(COLLECTION_NAME).document();
        producto.setId(docRef.getId());
        ApiFuture<WriteResult> collectionsApiFuture = docRef.set(producto);
        collectionsApiFuture.get();
        return producto.getId();
    }

    public Producto obtenerProducto(String id) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        if(document.exists()) {
            Producto producto = document.toObject(Producto.class);
            if (producto != null) {
                producto.setId(document.getId());
            }
            return producto;
        }
        return null;
    }

    public List<Producto> obtenerTodosLosProductos() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = dbFirestore.collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<Producto> productos = new ArrayList<>();
        for (QueryDocumentSnapshot document : documents) {
            Producto producto = document.toObject(Producto.class);
            producto.setId(document.getId());
            productos.add(producto);
        }
        return productos;
    }

    public List<Producto> obtenerProductosPorCategoria(String categoria) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = dbFirestore.collection(COLLECTION_NAME)
                .whereEqualTo("categoria", categoria)
                .get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<Producto> productos = new ArrayList<>();
        for (QueryDocumentSnapshot document : documents) {
            Producto producto = document.toObject(Producto.class);
            producto.setId(document.getId());
            productos.add(producto);
        }
        return productos;
    }

    public String actualizarProducto(Producto producto) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection(COLLECTION_NAME).document(producto.getId()).set(producto);
        return collectionsApiFuture.get().getUpdateTime().toString();
    }

    public String eliminarProducto(String id) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResult = dbFirestore.collection(COLLECTION_NAME).document(id).delete();
        return "Producto con ID " + id + " ha sido eliminado";
    }
}
