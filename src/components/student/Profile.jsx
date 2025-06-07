import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { UserAuth } from '../../context/AuthContext';
import model3 from '../../assets/model3.jpg';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaPen } from 'react-icons/fa';

const Profile = () => {
  const { session } = UserAuth();
  const user = session?.user;

  const [userPhotoUrl, setUserPhotoUrl] = useState(null);
  const [userData, setUserData] = useState({
    usercourse: '',
    userfaculty: '',
    userphone: '',
    userdescription: '',
  });

  const [applications, setApplications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState('');
  const [message, setMessage] = useState(null);

  // Fetch user photo and profile data
  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userphoto, usercourse, userfaculty, userphone, userdesc')
        .eq('userid', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
      } else {
        setUserPhotoUrl(data.userphoto || null);
        setUserData({
          usercourse: data.usercourse || '',
          userfaculty: data.userfaculty || '',
          userphone: data.userphone || '',
          userdescription: data.userdesc || '',
        });
        setDescriptionInput(data.userdesc || '');
      }
    };

    fetchData();
  }, [session, user?.id]);

  // Fetch user applications with event details
  useEffect(() => {
    if (!user) return;

    const fetchApplications = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('applicationid, status, dateapplied, events(eventname, type)')
        .eq('userid', user.id);

      if (error) {
        console.error('Error fetching applications:', error);
      } else {
        setApplications(data || []);
      }
    };

    fetchApplications();
  }, [user]);

  // Handle saving edited profile fields (course, faculty, phone)
  const handleSave = async () => {
    const { error } = await supabase
      .from('users')
      .update({
        usercourse: userData.usercourse,
        userfaculty: userData.userfaculty,
        userphone: userData.userphone,
      })
      .eq('userid', user.id);

    if (error) {
      setMessage({ type: 'error', text: 'Update failed!' });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    }
  };

  // Handle saving description
  const handleDescriptionSave = async () => {
    const { error } = await supabase
      .from('users')
      .update({ userdesc: descriptionInput })
      .eq('userid', user.id);

    if (error) {
      setMessage({ type: 'error', text: 'Description update failed!' });
    } else {
      setUserData((prev) => ({ ...prev, userdescription: descriptionInput }));
      setMessage({ type: 'success', text: 'Description updated successfully!' });
      setIsEditingDescription(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-[-1] opacity-60"
        style={{ backgroundImage: `url(${model3})` }}
      />
      <div className="max-w-4xl mx-auto">
        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="h-32 w-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-6xl mb-4 md:mb-0 md:mr-6">
              {userPhotoUrl ? (
                <img src={userPhotoUrl} className="h-full w-full object-cover rounded-full" alt="User" />
              ) : (
                <FaUser />
              )}
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                  {user?.user_metadata?.fullname || 'Complete your profile'}
                </h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-2 md:mt-0 flex items-center justify-center gap-1 text-white bg-[#56bb7c] px-4 py-2 rounded hover:bg-[#3E9B61]"
                >
                  <FaPen className="text-sm" /> {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="text-gray-600 mt-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Course:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.usercourse}
                      onChange={(e) => setUserData({ ...userData, usercourse: e.target.value })}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    <span>{userData.usercourse || 'Not set'}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-medium">Faculty:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.userfaculty}
                      onChange={(e) => setUserData({ ...userData, userfaculty: e.target.value })}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    <span>{userData.userfaculty || 'Not set'}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-medium">Phone:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.userphone}
                      onChange={(e) => setUserData({ ...userData, userphone: e.target.value })}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    <span>{userData.userphone || 'Not set'}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start mt-3 text-gray-600">
                <FaMapMarkerAlt className="mr-1" />
                <span>UPM</span>
              </div>
              <div className="flex items-center justify-center md:justify-start mt-2 text-gray-600">
                <FaEnvelope className="mr-1" />
                <span>{user?.email || 'Email not available'}</span>
              </div>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-800">Description</h2>
            <button
              onClick={() => setIsEditingDescription(!isEditingDescription)}
              className="text-blue-600 hover:text-blue-800"
            >
              {isEditingDescription ? 'Cancel' : 'Edit Description'}
            </button>
          </div>
          <div className="text-gray-700">
            {isEditingDescription ? (
              <>
                <textarea
                  rows="4"
                  className="w-full border rounded p-2"
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                />
                <button
                  onClick={handleDescriptionSave}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Description
                </button>
              </>
            ) : (
              <p className="whitespace-pre-wrap">{userData.userdescription || 'No description provided.'}</p>
            )}
          </div>
        </div>

        {/* Job and Program Applications */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Job and Program Applications</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      You have not applied to any jobs or programs yet.
                    </td>
                  </tr>
                ) : (
                  applications.map(({ applicationid, status, dateapplied, events }) => (
                <tr key={applicationid}>
                  <td className="px-6 py-4 text-sm text-gray-800">{events?.eventname || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{events?.type || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(dateapplied)}</td>
                  <td className="px-6 py-4 text-sm">
                    {status.toLowerCase() === 'under review' && (
                      <span className="px-2 inline-flex text-xs font-semibold leading-5 rounded-full bg-yellow-100 text-yellow-800">
                        Under Review
                      </span>
                    )}
                    {status.toLowerCase() === 'accepted' && (
                      <span className="px-2 inline-flex text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800">
                        Accepted
                      </span>
                    )}
                    {status.toLowerCase() === 'rejected' && (
                      <span className="px-2 inline-flex text-xs font-semibold leading-5 rounded-full bg-red-100 text-red-800">
                        Rejected
                      </span>
                    )}
                    {!['under review', 'accepted', 'rejected'].includes(status.toLowerCase()) && (
                      <span>{status}</span>
                    )}
                  </td>
                </tr>                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Other sections omitted for brevity */}
      </div>
    </div>
  );
};

export default Profile;
