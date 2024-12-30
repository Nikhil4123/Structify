/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Upload, UserPlus, Loader2, ArrowLeft, X } from "lucide-react";
import axios from "axios";

const MemberForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const teamId = location.state?.teamId;
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        uniqueId: "",
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError("");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB");
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError("Please upload an image file");
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError("Name is required");
            return false;
        }
        if (!formData.uniqueId.trim()) {
            setError("Unique ID is required");
            return false;
        }
        if (formData.name.length < 2) {
            setError("Name must be at least 2 characters long");
            return false;
        }
        if (formData.uniqueId.length < 3) {
            setError("Unique ID must be at least 3 characters long");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError("");

        const formPayload = new FormData();
        formPayload.append("name", formData.name.trim());
        formPayload.append("uniqueId", formData.uniqueId.trim());
        formPayload.append("teamId", teamId);

        if (image) {
            formPayload.append("image", image);
        }

        try {
            await axios.post(
                `${backendUrl}/api/members/${teamId}`,
                formPayload,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );
            setSuccess("Member added successfully!");
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to add member. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
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
                        <UserPlus className="w-8 h-8 text-blue-500 mr-3" />
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Member</h1>
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
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter member's name"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Unique ID
                            </label>
                            <input
                                type="text"
                                name="uniqueId"
                                value={formData.uniqueId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter unique identifier"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Image (optional)
                            </label>
                            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                                <div className="space-y-2 text-center">
                                    {imagePreview ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-32 w-32 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600">
                                                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                    <span>Upload a file</span>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="sr-only"
                                                        disabled={loading}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 5MB
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
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
                                {loading ? 'Adding Member...' : 'Add Member'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MemberForm;