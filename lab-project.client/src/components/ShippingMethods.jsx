// src/components/ShippingMethods.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ShippingMethods = () => {
  const [methods, setMethods] = useState([]);
  const [newMethod, setNewMethod] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editMethod, setEditMethod] = useState({ id: null, name: "" });

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    const response = await axios.get("/api/shippingmethods");
    setMethods(response.data);
  };

  const addMethod = async () => {
    if (newMethod.trim() === "") return;
    await axios.post("/api/shippingmethods", { name: newMethod });
    setNewMethod("");
    fetchMethods();
  };

  const deleteMethod = async (id) => {
    await axios.delete(`/api/shippingmethods/${id}`);
    fetchMethods();
  };

  const startEdit = (method) => {
    setEditMode(true);
    setEditMethod(method);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditMethod({ id: null, name: "" });
  };

  const updateMethod = async () => {
    if (editMethod.name.trim() === "") return;
    await axios.put(`/api/shippingmethods/${editMethod.id}`, {
      name: editMethod.name,
    });
    setEditMode(false);
    setEditMethod({ id: null, name: "" });
    fetchMethods();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl mb-4 font-semibold text-center text-white bg-gradient-to-r from-blue-400 to-indigo-500 py-2 rounded-lg shadow-md">
        Shipping Methods
      </h1>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={newMethod}
          onChange={(e) => setNewMethod(e.target.value)}
          placeholder="Add new method"
          className="border-2 border-gray-300 p-2 rounded-md w-full focus:outline-none focus:border-blue-500 transition duration-300 shadow-sm"
        />
        <button
          onClick={addMethod}
          className="bg-blue-500 text-white p-2 rounded-md ml-2 hover:bg-blue-600 transition duration-300 shadow-md"
        >
          Add
        </button>
      </div>
      {editMode && (
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={editMethod.name}
            onChange={(e) =>
              setEditMethod({ ...editMethod, name: e.target.value })
            }
            className="border-2 border-gray-300 p-2 rounded-md w-full focus:outline-none focus:border-green-500 transition duration-300 shadow-sm"
          />
          <button
            onClick={updateMethod}
            className="bg-green-500 text-white p-2 rounded-md ml-2 hover:bg-green-600 transition duration-300 shadow-md"
          >
            Update
          </button>
          <button
            onClick={cancelEdit}
            className="bg-gray-500 text-white p-2 rounded-md ml-2 hover:bg-gray-600 transition duration-300 shadow-md"
          >
            Cancel
          </button>
        </div>
      )}
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
            {methods.map((method, index) => (
              <tr
                key={method.id}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}
              >
                <td className="border-b border-gray-200 p-3">{method.name}</td>
                <td className="border-b border-gray-200 p-3 text-right">
                  <button
                    onClick={() => startEdit(method)}
                    className="bg-yellow-500 text-white p-2 rounded-md mr-2 hover:bg-yellow-600 transition duration-300 shadow-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMethod(method.id)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300 shadow-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShippingMethods;
