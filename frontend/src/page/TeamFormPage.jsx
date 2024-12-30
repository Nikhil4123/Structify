/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Loader2, Users, ArrowLeft } from "lucide-react";
import axios from "axios";

const TeamFormPage = () => {
    const { state } = useLocation();
    const { orgId } = state;
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [formData, setFormData] = useState({
        teamName: "",
        teamDescription: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError("");
    };

    const validateForm = () => {
        if (!formData.teamName.trim()) {
            setError("Team name is required");
            return false;
        }
        if (!formData.teamDescription.trim()) {
            setError("Team description is required");
            return false;
        }
        if (formData.teamName.length < 2) {
            setError("Team name must be at least 2 characters long");
            return false;
        }
        if (formData.teamDescription.length < 10) {
            setError("Description must be at least 10 characters long");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setError("");
        setSuccess("");

        const teamData = {
            name: formData.teamName.trim(),
            description: formData.teamDescription.trim(),
        };

        try {
            await axios.post(
                `${backendUrl}/api/teams/${orgId}`,
                teamData
            );
            setSuccess("Team created successfully!");
            setTimeout(() => {
                navigate(`/organizations/${orgId}`);
            }, 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to create team. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate(`/organizations/${orgId}`)}
                        className="inline-flex items-center px-4 py-2 text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center px-4 py-2 text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Home
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                    <div className="flex items-center mb-6">
                        <Users className="w-8 h-8 text-blue-500 mr-3" />
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New Team</h1>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Team Name
                            </label>
                            <input
                                type="text"
                                name="teamName"
                                value={formData.teamName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter team name"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Team Description
                            </label>
                            <textarea
                                name="teamDescription"
                                value={formData.teamDescription}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter team description"
                                disabled={loading}
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`inline-flex items-center px-6 py-3 rounded-lg text-white 
                                    ${loading 
                                        ? 'bg-blue-400 cursor-not-allowed' 
                                        : 'bg-blue-500 hover:bg-blue-600'} 
                                    transition-colors`}
                            >
                                {loading && (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                )}
                                {loading ? 'Creating Team...' : 'Create Team'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeamFormPage;