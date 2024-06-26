import { useEffect, useState } from "react";
import ModelTables from "../components/ModelTables";
import axios from "axios";

const Models = ({
  token,
  setToken,
  user,
  Models,
  setModels,
  ModelsFilter,
  setModelsFilter,
  emptyResults,
  setEmptyResults,
  search,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModels();
  }, []);

  const getModels = async () => {
    const { data } = await axios.get(`https://localhost:7262/Models/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setModels(data);
    setLoading(false);
  };
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <ModelTables
        type={"Models"}
        token={token}
        setToken={setToken}
        user={user}
        data={Models}
        setData={setModels}
        dataFilter={ModelsFilter}
        setDataFilter={setModelsFilter}
        loading={loading}
        emptyResults={emptyResults}
        setEmptyResults={setEmptyResults}
        search={search}
      />
    </div>
  );
};

export default Models;