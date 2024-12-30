/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Camera, Home, Plus, UserPlus, ArrowLeft } from "lucide-react";
import axios from "axios";

const OrganizationDetails = () => {
  const { orgId } = useParams();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchOrganizationDetails = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/organizations/${orgId}`
      );
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-sm">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Organization not found!</p>

          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {organization.name}
              </h1>
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {organization.email}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {organization.location}
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 transition-transform transform hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-transform transform hover:scale-105"
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Teams</h2>
            <button
              onClick={() => navigate(`/teamForm`, { state: { orgId } })}
              className="inline-flex items-center px-5 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-transform transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Team
            </button>
          </div>

          {organization.teams.length === 0 ? (
            <div className="text-center py-12 bg-gray-100 rounded-lg">
              <p className="text-gray-600 text-lg">
                No teams found for this organization.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {organization.teams.map((team) => (
                <div
                  key={team._id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {team.name}
                    </h3>
                    <button
                      onClick={() =>
                        navigate(`/memberForm`, { state: { teamId: team._id } })
                      }
                      className="inline-flex items-center px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105 text-sm"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Members
                    </button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Members</h4>
                    {team.members.length === 0 ? (
                      <p className="text-gray-500 text-sm">
                        No members found in this team.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {team.members.map((member) => (
                          <div
                            key={member._id}
                            className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-shadow"
                          >
                            {member.imageURL ? (
                              <img
                                src={member.imageURL}
                                alt={`${member.name}'s profile`}
                                className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">
                                  {member.name[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {member.name}
                              </p>
                              <p className="text-gray-500 text-xs">
                                ID: {member.uniqueId}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;
