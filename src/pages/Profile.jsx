import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, getAuthHeaders, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not logged in physically, redirect to login page instantly
    if (!user) {
      navigate("/"); // Adjust to your login route
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
          method: "GET",
          headers: getAuthHeaders(), // Automagically attach our Session JWT!
        });

        const data = await response.json();

        if (response.ok) {
          setProfileData(data);
        } else {
          // If token expired or is malicious, server returns 401
          setError(data.message);
          if (response.status === 401) {
            logout();
            navigate("/");
          }
        }
      } catch (err) {
        setError("Network error fetching profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-indigo-600 animate-pulse">Loading Secure Profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-4 mb-8">
          My Secure Profile
        </h1>
        
        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
            {error}
          </div>
        ) : profileData ? (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-1">Full Name</h3>
                  <p className="text-xl font-bold text-indigo-900">{profileData.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-1">Email Address</h3>
                  <p className="text-xl font-bold text-indigo-900">{profileData.email}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-indigo-200/50">
                <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-1">Account Created</h3>
                <p className="text-lg font-medium text-indigo-800">
                   {new Date(profileData.createdAt).toLocaleDateString(undefined, {
                     year: 'numeric',
                     month: 'long',
                     day: 'numeric'
                   })}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p>No profile data available.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
