import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OrganizationDetails = () => {
    const { orgId } = useParams(); // Extract the orgId from the URL
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate(); // To programmatically navigate to other pages
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Fetch organization details by ID
    const fetchOrganizationDetails = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/organizations/${orgId}`);
            setOrganization(response.data);
        } catch (err) {
            console.error("Error fetching organization details:", err);
            setError("Failed to load organization details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizationDetails();
    }, [orgId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!organization) return <p>Organization not found!</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{organization.name}</h1>
            <p className="mb-2">Email: {organization.email}</p>
            <p className="mb-4">Location: {organization.location}</p>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Teams</h2>
                <button
                    onClick={() => navigate(`/teamForm`, { state: { orgId } })}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Team
                </button>
            </div>

            {organization.teams.length === 0 ? (
                <p>No teams found for this organization.</p>
            ) : (
                <ul className="space-y-4">
                    {organization.teams.map((team) => (
                        <li key={team._id} className="border rounded px-4 py-2">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">{team.name}</h3>
                                <button
                                    onClick={() => navigate(`/memberForm`, { state: { teamId: team._id } })}
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                >
                                    Add Members
                                </button>
                            </div>
                            <h4 className="mt-2 text-sm font-medium text-gray-700">Members:</h4>
                            {team.members.length === 0 ? (
                                <p className="text-gray-500">No members found in this team.</p>
                            ) : (
                                <ul className="list-disc list-inside ml-4">
                                    {team.members.map((member) => (
                                        <li
                                            key={member._id}
                                            className="flex items-center space-x-4 text-sm text-gray-600"
                                        >
                                            {member.imageURL ? (
                                                <img
                                                    src={member.imageURL}
                                                    alt={`${member.name}'s profile`}
                                                    className="w-8 h-8 rounded-full border-2 border-green-500"
                                                />
                                            ) : (
                                                <div
                                                    className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center cursor-pointer"
                                                    onClick={() =>
                                                        navigate(`/addImage/${member._id}`)
                                                    }
                                                >
                                                    <span className="text-white text-xs">{member.name[0]}</span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium">{member.name}</p>
                                                <p className="text-gray-500 text-xs">Unique ID: {member.uniqueId}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrganizationDetails;
