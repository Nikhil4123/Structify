import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const TeamFormPage = () => {
    const { state } = useLocation();
    const { orgId } = state;  // Get the orgId from the state passed from the previous page
    const navigate = useNavigate();  // For redirection after team creation

    const [teamName, setTeamName] = useState("");
    const [teamDescription, setTeamDescription] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Assuming this env variable is set

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!teamName || !teamDescription) {
            setError("Please fill in all fields.");
            return;
        }

        const teamData = {
            name: teamName,
            description: teamDescription,
        };

        try {
            // Send the request to the backend to add the team
            const response = await axios.post(
                `${backendUrl}/api/teams/${orgId}`,  // Make sure the URL is using the correct orgId
                teamData
            );
            setSuccess("Team added successfully!");
            setError("");

            // Redirect to the organization details page with the orgId
            navigate(`/organizations/${orgId}`);  // Redirect to the correct organization page
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong!");
            setSuccess("");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Add a New Team</h1>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Team Name:</label>
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="border rounded px-4 py-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Team Description:</label>
                    <input
                        type="text"
                        value={teamDescription}
                        onChange={(e) => setTeamDescription(e.target.value)}
                        className="border rounded px-4 py-2 w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Team
                </button>
            </form>
        </div>
    );
};

export default TeamFormPage;
