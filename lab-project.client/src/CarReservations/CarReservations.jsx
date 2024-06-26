import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const CarReservations = ({ user }) => {
  const [reservations, setReservations] = useState([]);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("https://localhost:7262/Rents");
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    getCars();
  }, []);

  const getCars = async () => {
    const { data } = await axios.get(`https://localhost:7262/Cars/`);
    setCars(data);
    // setLoading(false);
  };
  return (
    <div className="w-full h-screen flex relative ">
      <div className="w-full h-full z-0  -mt-[74px] p-10 sm:px-6 bg-slate-100">
        <h2 className="text-2xl font-bold mb-4 mt-10">
          {user.role === "User" && "Your Car Reservations"}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {reservations.map(
            (reservation) =>
              (user.role === "Admin" || reservation.clientID == user.id) && (
                <div
                  key={reservation.rentalID}
                  className="bg-white p-4 shadow rounded-lg flex items-center gap-15"
                >
                  {cars.map((car) => {
                    if (car.id === reservation.carID) {
                      const imagePath =
                        "https://localhost:7262/Cars/image/" + car.id;
                      return (
                        <img
                          key={car.id}
                          src={imagePath}
                          alt={car.name}
                          className="w-40 h-40"
                        />
                      );
                    }
                    return null;
                  })}
                  <div className="flex flex-col gap-2">
                    {user.role === "Admin" && (
                      <p>
                        <b>User:</b> {reservation.clientName}
                      </p>
                    )}
                    <p className="font-bold text-xl">
                      {" "}
                      {cars.find((car) => car.id === reservation.carID)?.name}
                    </p>
                    <p className="font-medium text-lg text-neutral-600">
                      {" "}
                      {new Date(
                        reservation.startDate
                      ).toLocaleDateString()} -{" "}
                      {new Date(
                        new Date(reservation.startDate).getTime() +
                          reservation.days * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}{" "}
                    </p>
                    <p className="flex items-center gap-5">
                      {" "}
                      <b className="text-black text-lg">
                        {cars.find((car) => car.id === reservation.carID)
                          ?.price * reservation.days}{" "}
                        €
                      </b>{" "}
                      <FontAwesomeIcon
                        icon={faCircle}
                        className="text-neutral-400 text-[10px]"
                      />{" "}
                      <span className="text-lg text-neutral-600">
                        ({reservation.days}{" "}
                        {reservation.days === 1 ? "day" : "days"})
                      </span>
                    </p>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default CarReservations;
