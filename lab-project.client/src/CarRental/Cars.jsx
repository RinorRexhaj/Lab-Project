import { useEffect, useState } from "react";
import axios from "axios";
import CarTables from "../components/CarTables";

const Cars = ({ cars, setCars, carsFilter }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCars();
  }, []);

  const getCars = async () => {
    const { data } = await axios.get(`https://localhost:7262/Cars/`);
    setCars(data);
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <CarTables
        type={"Cars"}
        data={cars}
        setData={setCars}
        dataFilter={carsFilter}
        loading={loading}
      />
    </div>
  );
};

export default Cars;
