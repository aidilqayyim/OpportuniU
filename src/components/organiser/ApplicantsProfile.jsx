import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import model3 from '../../assets/model3.jpg';
import { FaUser, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

const Profile = () => {
  const [searchParams] = useSearchParams();
  const userid = searchParams.get('userid');

  const [userPhotoUrl, setUserPhotoUrl] = useState(null);
  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    usercourse: '',
    userfaculty: '',
    userphone: '',
    userdescription: '',
  });

  const [applications, setApplications] = useState([]);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!userid) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('userid', userid)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
      } else {
        setUserPhotoUrl(data.userphoto || null);
        setUserData({
          fullname: data.username || '',
          email: data.email || '',
          usercourse: data.usercourse || '',
          userfaculty: data.userfaculty || '',
          userphone: data.userphone || '',
          userdescription: data.userdesc || '',
        });
        setDescriptionInput(data.userdesc || '');
      }
    };

    fetchData();
  }, [userid]);

  useEffect(() => {
    const fetchApplications = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('applicationid, status, dateapplied, events(eventname, type)')
        .eq('userid', userid);

      if (!error) {
        setApplications(data);
      }
    };

    if (userid) fetchApplications();
  }, [userid]);

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
      <div
        className="absolute inset-0 bg-cover bg-center z-[-1] opacity-60"
        style={{ backgroundImage: `url(${model3})` }}
      />
      <div className="max-w-6xl mx-auto">
        {message && (
          <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start">
            <div className="h-32 w-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-6xl mb-4 lg:mb-0 lg:mr-6">
              {userPhotoUrl ? (
                <img src={userPhotoUrl} className="h-full w-full object-cover rounded-full" alt="User" />
              ) : (
                <FaUser />
              )}
            </div>
            <div className="w-full text-center lg:text-left">
              <h1 className="text-2xl font-bold text-gray-800">
                {userData.fullname || ''}
              </h1>

              <div className="text-gray-600 mt-4 space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <span className="font-medium">Course:</span>
                  <span>{userData.usercourse || 'Not set'}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <span className="font-medium">Faculty:</span>
                  <span>{userData.userfaculty || 'Not set'}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <span className="font-medium">Phone:</span>
                  <span>{userData.userphone || 'Not set'}</span>
                </div>
              </div>

              <div className="flex items-center justify-center lg:justify-start mt-3 text-gray-600">
                <FaMapMarkerAlt className="mr-1" />
                <span>UPM</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start mt-2 text-gray-600">
                <FaEnvelope className="mr-1" />
                <span>{userData.email || 'Email not available'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Description</h2>
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

        <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Job and Program Applications</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Event Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date Applied</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-sm text-gray-500">
                    You have not applied to any jobs or programs yet.
                  </td>
                </tr>
              ) : (
                applications.map(({ applicationid, status, dateapplied, events }) => (
                  <tr key={applicationid}>
                    <td className="px-4 py-2 text-sm text-gray-800">{events?.eventname || 'Unknown'}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{events?.type || 'N/A'}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{formatDate(dateapplied)}</td>
                    <td className="px-4 py-2 text-sm">
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Profile;
