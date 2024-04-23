import { useEffect, useState } from "react";
import Tables from "../components/Tables"
import axios from "axios";
  
const Products = ({products, setProducts, productsFilter }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        const { data } = await axios.get(`https://localhost:7262/Products/`);
        setProducts(data);
        setLoading(false);
    }

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <Tables type={"Products"} data={products} setData={setProducts} dataFilter={productsFilter} loading={loading}/>
        </div>
    ) 
}

export default Products