import React from "react";
import { useState, useEffect } from "react";
import RentModal from "../components/RentModal";

const CarRentalBox = ({ car, user }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  //Modal Handling
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    const handleClickOutsideModal = (event) => {
      if (event.target.classList.contains("overlay")) {
        closeModal();
      }
    };

    if (modalVisible) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("click", handleClickOutsideModal);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutsideModal);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutsideModal);
    };
  }, [modalVisible]);
  return (
    <div
      className="shadow-6 border-2 border-slate-200 rounded-xl cursor-pointer"
      onClick={() => {
        openModal();
      }}
    >
      <div className="flex justify-between items-center h-15 px-5">
        <h3 className="font-bold text-lg">{car.name}</h3>
        <p className=" font-semibold text-red-500">{car.price} € / day</p>
      </div>
      <img
        src={"https://localhost:7262/Cars/image/" + car.id}
        className="h-80 w-90"
      />
      <div className="flex justify-between items-center h-15 px-5">
        <p className="bg-slate-300 p-1 rounded-xl">Automatic</p>
        <p className="bg-slate-300 p-1 rounded-xl">{car.modelName}</p>
        <p className="bg-slate-300 p-1 rounded-xl">5 seats</p>
        <p className="bg-slate-300 p-1 rounded-xl">2.0 L</p>
      </div>
      <RentModal car={car} modalVisible={modalVisible} user={user} />
    </div>
  );
};

export default CarRentalBox;
