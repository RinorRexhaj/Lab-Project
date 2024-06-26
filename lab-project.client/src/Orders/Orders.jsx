import React, { useState, useEffect } from "react";
import Invoice from "../components/Invoice";
import axios from "axios";

const Orders = () => {
  const [shippingMethods, setShippingMethods] = useState([]);

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  const fetchShippingMethods = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7262/shippingmethods"
      );
      setShippingMethods(response.data);
    } catch (error) {
      console.error("Error fetching shipping methods", error);
    }
  };

  const addShippingMethod = async (method) => {
    try {
      const response = await axios.post("/shipping-methods", { method });
      setShippingMethods([...shippingMethods, response.data]);
    } catch (error) {
      console.error("Error adding shipping method", error);
    }
  };

  const editShippingMethod = async (oldMethod, newMethod) => {
    try {
      await axios.put(`/shipping-methods/${oldMethod}`, { newMethod });
      setShippingMethods(
        shippingMethods.map((m) => (m === oldMethod ? newMethod : m))
      );
    } catch (error) {
      console.error("Error editing shipping method", error);
    }
  };

  const deleteShippingMethod = async (method) => {
    try {
      await axios.delete(`/shipping-methods/${method}`);
      setShippingMethods(shippingMethods.filter((m) => m !== method));
    } catch (error) {
      console.error("Error deleting shipping method", error);
    }
  };

  return (
    <div className="p-6">
      <Invoice shippingMethods={shippingMethods} />
    </div>
  );
};

export default Orders;
