import React, { useEffect, useState } from 'react'; // Asegúrate de importar useState
import ProductCard from './ProductCard';
import { db } from '../../config/firebaseConfig';
import { collection, getDocs} from 'firebase/firestore';
// Define el componente Home que contiene una lista de ProductCards

function ProductCardHome() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null); // Estado para manejar los errores

    useEffect (() => {
        const fetchProducts = async () => {
            try {
                const productsCollections = collection(db, "Productos");
                const productSnapshot = await getDocs(productsCollections);
                const productList = productSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log(productList);
                setProducts(productList);
            } catch (error) {
                setError("Error al cargar los productos");
                console.error("Error buscando productos: ", error);
            }
        }
        
        fetchProducts();
    }, [])

    return (
        <div className="articles"> 
            {products.map((product) => (
                <ProductCard key={product.id} product={product}/>
            ))}
        </div>
    );
}

export default ProductCardHome;