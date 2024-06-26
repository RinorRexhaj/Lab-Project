// src/ShippingMethod/ShippingMethod.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ShippingMethod = () => {
  const [shippingMethod, setShippingMethod] = useState([]);
  const [newMethod, setNewMethod] = useState("");
  const [editMethod, setEditMethod] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  const fetchShippingMethods = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7262/shippingmethods"
      );
      setShippingMethod(response.data);
    } catch (error) {
      console.error("Error fetching shipping methods", error);
    }
  };

  const addShippingMethod = async (method) => {
    try {
      const response = await axios.post(
        "https://localhost:7262/shippingmethods",
        { name: method }
      );
      setShippingMethod([...shippingMethod, response.data]);
    } catch (error) {
      console.error("Error adding shipping method", error);
    }
  };

  const editShippingMethod = async (oldMethod, newMethod) => {
    try {
      await axios.put(`https://localhost:7262/shippingmethods/`, {
        name: oldMethod,
        newName: newMethod,
      });
      setShippingMethod(
        shippingMethod.map((m) => {
          if (m.name === oldMethod) return { ...m, name: newMethod };
          return m;
        })
      );
    } catch (error) {
      console.error("Error editing shipping method", error);
    }
  };

  const deleteShippingMethod = async (method) => {
    try {
      await axios.delete(`https://localhost:7262/shippingmethods/${method}`, {
        name: method,
      });
      setShippingMethod(shippingMethod.filter((m) => m.name !== method));
    } catch (error) {
      console.error("Error deleting shipping method", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl mb-4 font-medium text-center text-white bg-gradient-to-r from-blue-400 to-indigo-500 py-2 rounded-lg shadow-md">
        Manage Shipping Methods
      </h1>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={newMethod}
          onChange={(e) => setNewMethod(e.target.value)}
          placeholder="Add new shipping method"
          className="border-2 border-gray-300 p-2 rounded-md w-full focus:outline-none focus:border-blue-500 transition duration-300 shadow-sm"
        />
        <button
          onClick={() => {
            addShippingMethod(newMethod);
            setNewMethod("");
          }}
          className="bg-blue-500 text-white p-2 rounded-md ml-2 hover:bg-blue-600 transition duration-300 shadow-md"
        >
          Add
        </button>
      </div>
      <div className="rounded-lg overflow-hidden shadow-lg">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white">
            <tr>
              <th className="border-b-2 border-gray-200 p-3 text-left text-sm uppercase tracking-wider">
                Shipping Method
              </th>
              <th className="border-b-2 border-gray-200 p-3 text-right text-sm uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {shippingMethod.map((method, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}
              >
                <td className="border-b border-gray-200 p-3">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={editMethod}
                      onChange={(e) => setEditMethod(e.target.value)}
                      className="border-2 border-gray-300 p-2 rounded-md w-full focus:outline-none focus:border-green-500 transition duration-300 shadow-sm"
                    />
                  ) : (
                    <p>{method.name}</p>
                  )}
                </td>
                <td className="border-b border-gray-200 p-3 text-right">
                  {editingIndex === index ? (
                    <button
                      onClick={() => {
                        editShippingMethod(method.name, editMethod);
                        setEditingIndex(null);
                        setEditMethod("");
                      }}
                      className="bg-green-500 text-white p-2 rounded-md ml-2 hover:bg-green-600 transition duration-300 shadow-md"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingIndex(index);
                          setEditMethod(method.name);
                        }}
                        className="bg-yellow-500 text-white p-2 rounded-md mr-2 hover:bg-yellow-600 transition duration-300 shadow-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteShippingMethod(method.name)}
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300 shadow-md"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShippingMethod;
