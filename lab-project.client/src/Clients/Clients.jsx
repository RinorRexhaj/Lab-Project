import React, { useState, useEffect } from "react";
import axios from "axios";

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newClientData, setNewClientData] = useState({ id: "", fullName: "", email: "" });
    const [editingClientId, setEditingClientId] = useState(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get("https://localhost:7262/Clients");
            setClients(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching clients:", error);
            setLoading(false);
        }
    };

    const deleteClient = async (id) => {
        try {
            await axios.delete(`https://localhost:7262/Clients/${id}`);
            setClients(clients.filter(client => client.id !== id));
        } catch (error) {
            console.error("Error deleting client:", error);
        }
    };

    const editClient = (id) => {
        setEditingClientId(id);
        const clientToEdit = clients.find(client => client.id === id);
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
                await axios.put(`https://localhost:7262/Clients/${newClientData.id}`, newClientData);
                const updatedClients = clients.map(client =>
                    client.id === newClientData.id ? newClientData : client
                );
                setClients(updatedClients);
                setEditingClientId(null);
                setNewClientData({ id: "", fullName: "", email: "" });
                setEditing(false);
            } else {
                const response = await axios.post("https://localhost:7262/Clients", newClientData);
                setClients([...clients, response.data]);
                setNewClientData({ id: "", fullName: "", email: "" });
            }
        } catch (error) {
            console.error("Error saving client:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClientData({ ...newClientData, [name]: value });
    };

    return (        
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Client list</h1>
            <div className="mb-4">
                {!editing && ( // Shtojmë këtë pjesë që të shfaqet butoni vetëm kur nuk jemi duke redaktuar një klient
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setEditing(true)}
                    >
                        Add Client
                    </button>
                )}
            </div>
            {editing && (
    <div className="mb-4">
        <input
            type="text"
            name="id"
            value={newClientData.id}
            onChange={handleInputChange}
            placeholder="ID"
            className="border border-gray-400 p-2 mr-2"
        />
        <input
            type="text"
            name="fullName"
            value={newClientData.fullName}
            onChange={handleInputChange}
            placeholder="Emri"
            className="border border-gray-400 p-2 mr-2"
        />
        <input
            type="email"
            name="email"
            value={newClientData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="border border-gray-400 p-2 mr-2"
        />
        <select
            name="role"
            value={newClientData.role}
            onChange={handleInputChange}
            className="border border-gray-400 p-2 mr-2"
        >
            <option value="">Zgjidh Rolin</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="guest">Guest</option>
        </select>
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={saveClient}
        >
            {editingClientId ? "Save" : "Add Client"}
        </button>
        <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={cancelEdit}
        >
            Cancel
        </button>
    </div>
)}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Emri</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Roli</th>
                            <th className="px-4 py-2">Veprimet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td className="border px-20 py-2">{client.id}</td>
                                <td className="border px-20 py-2">{client.fullName}</td>
                                <td className="border px-20 py-2">{client.email}</td>
                                <td className="border px-15 py-2">{client.role}</td> {/* Shto këtë rresht për të shfaqur rolin */}
                                <td className="border px-20 py-2">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                        onClick={() => editClient(client.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => deleteClient(client.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Clients;
