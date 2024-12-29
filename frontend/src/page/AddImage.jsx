import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AddImage = () => {
    const { memberId } = useParams(); // Get memberId from URL params
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            setError("Please upload an image.");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await axios.post(
                `${backendUrl}/api/members/upload/${memberId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setSuccess("Image uploaded successfully!");
            setError("");

            // Delay the redirection for 2 seconds to let the success message display
            setTimeout(() => {
                navigate("/"); // Redirect to the home page after success
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong!");
            setSuccess("");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Upload Image</h2>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                    <label className="block mb-2">Select Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border rounded px-4 py-2 w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Upload Image
                </button>
            </form>
        </div>
    );
};

export default AddImage;
