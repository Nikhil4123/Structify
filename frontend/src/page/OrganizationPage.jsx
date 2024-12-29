import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrganizationPage = () => {
    const [organizations, setOrganizations] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Fetch all organizations
    const fetchOrganizations = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/organizations`);
            setOrganizations(response.data);
        } catch (err) {
            console.error("Error fetching organizations:", err);
        }
    };

    // Handle form submission to add a new organization
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !location) {
            setError("All fields are required.");
            return;
        }

        try {
            await axios.post(`${backendUrl}/api/organizations`, {
                name,
                email,
                location,
            });
            setSuccess("Organization added successfully!");
            setError("");
            setName("");
            setEmail("");
            setLocation("");
            fetchOrganizations(); // Refresh the organization list
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong!");
            setSuccess("");
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Manage Organizations</h1>

            {/* Add Organization Form */}
            <div className="bg-white p-4 rounded shadow-md mb-6">
                <h2 className="text-lg font-semibold mb-2">Add Organization</h2>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border rounded px-4 py-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border rounded px-4 py-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium mb-1">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="border rounded px-4 py-2 w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add Organization
                    </button>
                </form>
            </div>

            {/* List of Organizations */}
            <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-lg font-semibold mb-2">All Organizations</h2>
                {organizations.length === 0 ? (
                    <p>No organizations found.</p>
                ) : (
                    <ul className="space-y-2">
                        {organizations.map((org) => (
                            <li
                                key={org._id}
                                className="border rounded px-4 py-2 flex justify-between items-center cursor-pointer"
                                onClick={() => navigate(`/organizations/${org._id}`)}
                            >
                                <div>
                                    <h3 className="font-semibold">{org.name}</h3>
                                    <p className="text-sm text-gray-500">{org.location}</p>
                                </div>
                                <span className="text-gray-400 text-sm">ID: {org._id}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default OrganizationPage;
