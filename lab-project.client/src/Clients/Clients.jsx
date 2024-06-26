import React, { useState, useEffect } from "react";
import axios from "axios";
import Tables from "../components/Tables";

const Clients = ({
  token,
  setToken,
  user,
  clients,
  setClients,
  clientsFilter,
  setClientsFilter,
  emptyResults,
  setEmptyResults,
  setRole,
  search,
}) => {
  const [loading, setLoading] = useState(true);
  const [newClientData, setNewClientData] = useState({
    id: "",
    fullName: "",
    email: "",
  });
  const [editingClientId, setEditingClientId] = useState(null);
  const [editing, setEditing] = useState(false);

  const fetchClients = async () => {
    const response = await axios.get("https://localhost:7262/Clients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setClients(response.data);
    setLoading(false);
  };

  const deleteClient = async (id) => {
    try {
      await axios.delete(`https://localhost:7262/Clients/${id}`);
      setClients(clients.filter((client) => client.id !== id));
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const editClient = (id) => {
    setEditingClientId(id);
    const clientToEdit = clients.find((client) => client.id === id);
    setNewClientData(clientToEdit);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditingClientId(null);
    setNewClientData({ id: "", fullName: "", email: "" });
    setEditing(false);
  };

  const saveClient = async () => {
    try {
      if (editingClientId) {
        await axios.patch(
          `https://localhost:7262/Clients/${newClientData.id}`,
          newClientData
        );
        const updatedClients = clients.map((client) =>
          client.id === newClientData.id ? newClientData : client
        );
        setClients(updatedClients);
        setEditingClientId(null);
        setNewClientData({ id: "", fullName: "", email: "" });
        setEditing(false);
      } else {
        const response = await axios.post(
          "https://localhost:7262/Clients",
          newClientData
        );
        setClients([...clients, response.data]);
        setNewClientData({ id: "", fullName: "", email: "" });
      }
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClientData({ ...newClientData, [name]: value });
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Tables
        type={"Clients"}
        token={token}
        setToken={setToken}
        user={user}
        data={clients}
        setData={setClients}
        dataFilter={clientsFilter}
        setDataFilter={setClientsFilter}
        loading={loading}
        emptyResults={emptyResults}
        setEmptyResults={setEmptyResults}
        setCategory={setRole}
        search={search}
      />
    </div>
  );
};

export default Clients;
