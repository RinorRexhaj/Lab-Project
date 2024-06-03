import { useEffect, useState } from "react";
import Tables from "../components/Tables";
import axios from "axios";

const Categories = ({
  token,
  setToken,
  user,
  categories,
  setCategories,
  categoriesFilter,
  setCategoriesFilter,
  emptyResults,
  setEmptyResults,
  search,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const { data } = await axios.get(`https://localhost:7262/Categories/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCategories(data);
    setLoading(false);
  };
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Tables
        type={"Categories"}
        token={token}
        setToken={setToken}
        user={user}
        data={categories}
        setData={setCategories}
        dataFilter={categoriesFilter}
        setDataFilter={setCategoriesFilter}
        loading={loading}
        emptyResults={emptyResults}
        setEmptyResults={setEmptyResults}
        search={search}
      />
    </div>
  );
};

export default Categories;
