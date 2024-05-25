import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCalendarCheck,
  faCalendarDay,
  faCircleCheck,
  faLocation,
  faLocationArrow,
  faLocationCrosshairs,
  faLocationDot,
  faPenToSquare,
  faPencil,
  faPencilAlt,
  faPlus,
  faTooth,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const RentModal = ({ car, modalVisible }) => {
  const today = new Date();
  const defaultDeliveryDate = new Date(today);
  defaultDeliveryDate.setDate(today.getDate() + 1);
  const defaultReturnDate = new Date(today);
  defaultReturnDate.setDate(today.getDate() + 2);

  const [deliveryDate, setDeliveryDate] = useState(defaultDeliveryDate);
  const [returnDate, setReturnDate] = useState(defaultReturnDate);
  const [showDeliveryCalendar, setShowDeliveryCalendar] = useState(false);
  const [showReturnCalendar, setShowReturnCalendar] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState("10:00 - 11:00");
  const [returnTime, setReturnTime] = useState("10:00 - 11:00");

  const [showDeliveryMap, setShowDeliveryMap] = useState(false);
  const [showReturnMap, setShowReturnMap] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [returnAddress, setReturnAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDeliveryDateChange = (date) => {
    setDeliveryDate(date);
    setShowDeliveryCalendar(false);
    const newReturnDate = new Date(date);
    newReturnDate.setDate(date.getDate() + 1);
    setReturnDate((prevReturnDate) =>
      prevReturnDate <= date ? newReturnDate : prevReturnDate
    );
  };

  const handleReturnDateChange = (date) => {
    setReturnDate(date);
    setShowReturnCalendar(false);
  };
  const timeOptions = [
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
  ];

  const handleDeliveryTimeChange = (event) => {
    setDeliveryTime(event.target.value);
  };

  const handleReturnTimeChange = (event) => {
    setReturnTime(event.target.value);
  };
  const calculateTotalPrice = () => {
    const timeDiff = returnDate.getTime() - deliveryDate.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return car.price * dayDiff;
  };

  const LocationMarker = ({ setAddress }) => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (isLocationInKosovo(lat, lng)) {
          setAddress({ lat, lng });
          setErrorMessage("");
        } else {
          setErrorMessage("Location must be within Kosovo.");
        }
      },
    });

    return null;
  };

  const isLocationInKosovo = (lat, lng) => {
    const kosovoBounds = {
      north: 43.26,
      south: 41.85,
      west: 20.03,
      east: 21.78,
    };
    return (
      lat <= kosovoBounds.north &&
      lat >= kosovoBounds.south &&
      lng >= kosovoBounds.west &&
      lng <= kosovoBounds.east
    );
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        modalVisible ? "opacity-100 z-50" : "opacity-0 -z-99"
      } transition-opacity duration-200 ease-in`}
    >
      <div className="bg-white p-8 rounded-md z-50 w-125 md:w-80 h-[550px] mt-20 overflow-y-auto">
        <form action="" className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className=" text-lg font-bold text-slate-600">{car.name}</h2>
            <div className="flex flex-col items-center">
              <p className="font-semibold text-red-500">{car.price} € / day</p>
              <p className="text-sm">Total {calculateTotalPrice()} €</p>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold p-2">Delivery</h1>
            <div className="shadow-2 rounded-xl ">
              <div className="flex flex-col gap-5 p-2">
                <div className="flex items-center justify-between">
                  <FontAwesomeIcon icon={faCalendarDay} />
                  <div>
                    <p className="font-semibold">
                      {deliveryDate.toDateString()}
                    </p>
                    <p>{deliveryTime}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setShowDeliveryCalendar(!showDeliveryCalendar)
                    }
                  >
                    <FontAwesomeIcon icon={faPencil} color="red" />
                  </button>
                </div>
                {showDeliveryCalendar && (
                  <div className="flex">
                    <div>
                      <DatePicker
                        selected={deliveryDate}
                        onChange={handleDeliveryDateChange}
                        inline
                        minDate={defaultDeliveryDate}
                      />
                    </div>
                    <div className="ml-8 border border-slate-400 rounded-md">
                      {timeOptions.map((time) => (
                        <>
                          <div key={time} className="flex items-center p-[3px]">
                            <input
                              type="radio"
                              id={`delivery-time-${time}`}
                              name="delivery-time"
                              value={time}
                              checked={deliveryTime === time}
                              onChange={handleDeliveryTimeChange}
                              className="mr-2"
                            />
                            <label
                              htmlFor={`delivery-time-${time}`}
                              className="cursor-pointer"
                            >
                              {time}
                            </label>
                          </div>
                          <hr className="text-slate-300" />
                        </>
                      ))}
                    </div>
                  </div>
                )}
                <hr className="text-slate-300" />
                <div className="flex items-center justify-between">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <div>
                    <p className="font-semibold">Please select address</p>
                    <p>
                      {deliveryAddress
                        ? `Lat: ${deliveryAddress.lat}, Lng: ${deliveryAddress.lng}`
                        : "No address selected"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeliveryMap(!showDeliveryMap)}
                  >
                    <FontAwesomeIcon icon={faPencil} color="red" />
                  </button>
                </div>
                {showDeliveryMap && (
                  <div className="">
                    <MapContainer
                      center={[42.6026, 20.903]}
                      zoom={8}
                      style={{ height: "300px" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationMarker setAddress={setDeliveryAddress} />
                      {deliveryAddress && (
                        <Marker
                          position={[deliveryAddress.lat, deliveryAddress.lng]}
                        />
                      )}
                    </MapContainer>
                    {errorMessage && (
                      <p className="text-red-500 mt-2">{errorMessage}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold p-2">Return</h1>
            <div className="shadow-2 rounded-xl ">
              <div className="flex flex-col gap-5 p-2">
                <div className="flex items-center justify-between">
                  <FontAwesomeIcon icon={faCalendarDay} />
                  <div>
                    <p className="font-semibold">{returnDate.toDateString()}</p>
                    <p>{returnTime}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowReturnCalendar(!showReturnCalendar)}
                  >
                    <FontAwesomeIcon icon={faPencil} color="red" />
                  </button>
                </div>
                {showReturnCalendar && (
                  <div className="flex">
                    <div>
                      <DatePicker
                        selected={returnDate}
                        onChange={handleReturnDateChange}
                        inline
                        minDate={defaultDeliveryDate}
                        filterDate={(date) => date >= deliveryDate}
                      />
                    </div>
                    <div className="ml-8 border border-slate-400 rounded-md">
                      {timeOptions.map((time) => (
                        <>
                          <div key={time} className="flex items-center p-[3px]">
                            <input
                              type="radio"
                              id={`return-time-${time}`}
                              name="return-time"
                              value={time}
                              checked={returnTime === time}
                              onChange={handleReturnTimeChange}
                              className="mr-2"
                            />
                            <label
                              htmlFor={`return-time-${time}`}
                              className="cursor-pointer"
                            >
                              {time}
                            </label>
                          </div>
                          <hr className="text-slate-300" />
                        </>
                      ))}
                    </div>
                  </div>
                )}
                <hr className="text-slate-300" />
                <div className="flex items-center justify-between">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <div>
                    <p className="font-semibold">Please select address</p>
                    <p>
                      {returnAddress
                        ? `Lat: ${returnAddress.lat}, Lng: ${returnAddress.lng}`
                        : "No address selected"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowReturnMap(!showReturnMap)}
                  >
                    <FontAwesomeIcon icon={faPencil} color="red" />
                  </button>
                </div>
                {showReturnMap && (
                  <div className="">
                    <MapContainer
                      center={[42.6026, 20.903]}
                      zoom={8}
                      style={{ height: "300px" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationMarker setAddress={setReturnAddress} />
                      {returnAddress && (
                        <Marker
                          position={[returnAddress.lat, returnAddress.lng]}
                        />
                      )}
                    </MapContainer>
                    {errorMessage && (
                      <p className="text-red-500 mt-2">{errorMessage}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-medium text-slate-600">Car contains:</h2>
            <div className="flex gap-3 mt-3">
              <p className="bg-slate-300 p-1 pl-5 rounded-xl flex items-center justify-center">
                Spare wheel
              </p>
              <p className="bg-slate-300 p-1 pl-5 rounded-xl flex items-center justify-center">
                Parking Sensors
              </p>
              <p className="bg-slate-300 p-1 pl-5 rounded-xl flex items-center justify-center">
                Electric mirror
              </p>
              <p className="bg-slate-300 p-1 pl-5 rounded-xl flex items-center justify-center">
                Eletric Windows
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="text-white font-bold text-xl bg-red-600 p-2 rounded-lg hover:scale-[1.006]"
          >
            Book Car
          </button>
        </form>
      </div>
      <div className="overlay fixed inset-0 bg-black opacity-50"></div>
    </div>
  );
};

export default RentModal;
