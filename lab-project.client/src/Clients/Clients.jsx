import React, { useState, useEffect } from "react";
import axios from "axios";

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    // Funksioni për të marrë listën e klientëve nga API
    const fetchClients = async () => {
        try {
            const response = await axios.get("https://localhost:5173/Client"); // Thirrja GET në adresën e API-së për të marrë klientët
            console.log(response)
            setClients(response.data); // Përditësoni listën e klientëve me të dhënat e marrura
            setLoading(false); // Shënjestroni se ngarkimi është kompleto
        } catch (error) {
            console.error("Error fetching clients:", error);
            setLoading(false); // Nëse ka ndonjë gabim, shënjestroni se ngarkimi është kompleto
        }
    };

    // Efekti i ngarkimit të komponentit për të marrë listën e klientëve
    useEffect(() => {
        fetchClients();
    }, []); // Kjo do të thirret vetëm një herë pas ngarkimit të parë të komponentit

    // Funksioni për të fshirë një klient nga lista
    const deleteClient = async (id) => {
        try {
            await axios.delete(`https://localhost:5173/api/Client/${id}`); // Thirrja DELETE në adresën e API-së për të fshirë klientin
            setClients(clients.filter(client => client.id !== id)); // Përditësoni listën e klientëve duke hequr klientin e fshirë
        } catch (error) {
            console.error("Error deleting client:", error);
        }
    };

    // Funksioni për të redaktuar një klient
    const editClient = (id) => {
        // Krijoni logjikën për redaktimin e klientit
        console.log("Editing client with ID:", id);
    };

    return (
        <div>
            <h1>Lista e Klientëve</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Emri</th>
                            <th>Email</th>
                            <th>Veprimet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.length >0 && clients.map((client) => (
                            <tr key={client.id}>
                                <td>{client.id}</td>
                                <td>{client.fullName}</td>
                                <td>{client.email}</td>
                                <td>
                                    <button onClick={() => editClient(client.id)}>Edit</button>
                                    <button onClick={() => deleteClient(client.id)}>Delete</button>
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
