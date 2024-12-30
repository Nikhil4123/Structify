/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrganizationPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/organizations`);
      setOrganizations(response.data);
    } catch (err) {
      setError("Failed to fetch organizations. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.location) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${backendUrl}/api/organizations`, formData);
      setSuccess("Organization added successfully!");
      setFormData({ name: "", email: "", location: "" });
      fetchOrganizations();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add organization.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Organizations</h1>
                <p className="text-gray-500 text-sm sm:text-base">Manage your organization details and memberships</p>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg self-start">
                <span className="text-blue-700 font-medium">{organizations.length}</span>
                <span className="text-blue-600 ml-1">
                  {organizations.length === 1 ? 'organization' : 'organizations'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden lg:sticky lg:top-6 lg:h-fit">
            <div className="p-6 sm:p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-xl font-semibold text-gray-900">Add New Organization</h2>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">Create a new organization profile</p>
            </div>

            <div className="p-6 sm:p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm sm:text-base flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                  </svg>
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm sm:text-base flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                      placeholder="Enter organization name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                      placeholder="contact@organization.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full sm:w-auto px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Adding..." : "Add Organization"}
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-xl font-semibold text-gray-900">All Organizations</h2>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">View and manage your registered organizations</p>
            </div>

            <div className="divide-y divide-gray-200">
              {organizations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="text-gray-400 mb-3">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">No organizations found</p>
                  <p className="text-gray-400 text-sm">Add your first organization using the form</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 p-4">
                  {organizations.map((org) => (
                    <div
                      key={org._id}
                      onClick={() => navigate(`/organizations/${org._id}`)}
                      className="p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <h3 className="font-medium text-lg text-gray-900">{org.name}</h3>
                          <div className="flex items-center text-gray-500 text-sm">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            {org.location}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <span className="hidden sm:inline">ID: {org._id}</span>
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;