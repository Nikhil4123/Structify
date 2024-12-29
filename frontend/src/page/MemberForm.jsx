import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const MemberForm = () => {
    const location = useLocation();
    const teamId = location.state?.teamId;

    const [name, setName] = useState("");
    const [uniqueId, setUniqueId] = useState("");
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Fetch backend URL from environment variables

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !uniqueId) {
            setError("Name and Unique ID are required.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("uniqueId", uniqueId);
        formData.append("teamId", teamId);

        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/members/${teamId}`,
                image ? formData : { name, uniqueId, teamId }, // Send JSON if no image, FormData if image exists
                {
                    headers: image 
                        ? { "Content-Type": "multipart/form-data" }
                        : { "Content-Type": "application/json" }
                }
            );
            setSuccess("Member added successfully!");
            setError("");
            setName("");
            setUniqueId("");
            setImage(null);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong!");
            setSuccess("");
        }
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className="member-form p-6">
            <h2 className="text-2xl font-semibold mb-4">Add Member</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                    <label className="block mb-2">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded px-4 py-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Unique ID:</label>
                    <input
                        type="text"
                        value={uniqueId}
                        onChange={(e) => setUniqueId(e.target.value)}
                        className="border rounded px-4 py-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Image (optional):</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border rounded px-4 py-2 w-full"
                    />
                </div>
                <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Add Member
                </button>
            </form>
        </div>
    );
};

export default MemberForm;
