import { useEffect, useState } from "react";
import Tables from "../components/Tables"
import axios from "axios";
  
const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            const { data } = await axios.get("https://localhost:7262/Product");
            setProducts(data);
        }
        getProducts()
    }, [])

    return (
        <div className="w-full flex flex-col justify-center items-center">
            {/* <h1 className="text-5xl font-semibold    flex justify-center items-center">Products</h1> */}
            <Tables products={products}/>
        </div>
    ) 
}

export default Products