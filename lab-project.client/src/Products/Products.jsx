import { useEffect, useState } from "react";
import Tables from "../components/Tables";
import axios from "axios";

const Products = ({
  token,
  setToken,
  user,
  products,
  setProducts,
  productsFilter,
  setProductsFilter,
  emptyResults,
  setEmptyResults,
  setCategory,
  search,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const { data } = await axios.get(`https://localhost:7262/Products/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setProducts(data);
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Tables
        type={"Products"}
        token={token}
        setToken={setToken}
        user={user}
        data={products}
        setData={setProducts}
        dataFilter={productsFilter}
        setDataFilter={setProductsFilter}
        loading={loading}
        emptyResults={emptyResults}
        setEmptyResults={setEmptyResults}
        setCategory={setCategory}
        search={search}
      />
    </div>
  );
};

export default Products;
