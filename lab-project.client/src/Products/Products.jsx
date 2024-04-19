import { useEffect, useState } from "react";
import Tables from "../components/Tables"
import axios from "axios";
  
const Products = ({products, setProducts, productsAll, setProductsAll, productsFilter, scrollFetch }) => {
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        getProducts();
    }, [scrollFetch]);

    const getProducts = async () => {
        const { data } = await axios.get(`https://localhost:7262/Products/offset/${offset}`);
        setOffset(offset + 50);
        setProducts([...products, ...data]);
        setLoading(false);
    }

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <Tables products={products} productsFilter={productsFilter} loading={loading}/>
        </div>
    ) 
}

export default Products