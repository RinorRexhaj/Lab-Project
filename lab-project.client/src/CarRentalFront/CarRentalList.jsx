import React, { useState, useEffect } from "react";
import CarRentalBox from "./CarRentalBox";
import axios from "axios";

const CarRentalList = ({ cars, setCars }) => {
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
    <div className="min-h-50 flex flex-wrap gap-8 justify-center items-center">
      {cars.map((car) => (
        <CarRentalBox car={car} />
      ))}
    </div>
  );
};

export default CarRentalList;
