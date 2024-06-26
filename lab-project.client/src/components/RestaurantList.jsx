import React, { useState } from "react";
import ReservationModal from "./ReservationModal";

const RestaurantList = ({ restaurants }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const openModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRestaurant(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Restaurants</h2>
      <ul>
        {restaurants.map((restaurant) => (
          <li
            key={restaurant.id}
            className="flex justify-between items-center mb-4 p-4 bg-white shadow rounded"
          >
            <div>
              <h3 className="text-xl font-semibold">{restaurant.name}</h3>
              <p>Category: {restaurant.category}</p>
              <p>Stars: {"⭐".repeat(restaurant.stars)}</p>
              <p>Price Range: {restaurant.priceRange}</p>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => openModal(restaurant)}
            >
              Reserve a Table
            </button>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <ReservationModal
          restaurant={selectedRestaurant}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default RestaurantList;
