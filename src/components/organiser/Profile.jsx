import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { UserAuth } from '../../context/AuthContext';
import model3 from '../../assets/model3.jpg';
import { FaUser, FaEnvelope, FaPhone, FaPen } from 'react-icons/fa';

const Profile = () => {
  const { session } = UserAuth();
  const user = session?.user;

  const [employerData, setEmployerData] = useState({
    empname: '',
    empphoto: null,
    empemail: '',
    empphone: '',
  });

  const [myEvents, setMyEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!session) return;

    const fetchEmployerData = async () => {
      const { data, error } = await supabase
        .from('employers')
        .select('empname, empphoto, empemail, empphone')
        .eq('empid', user.id)
        .single();

      if (error) {
        console.error('Error fetching employer data:', error);
      } else {
        setEmployerData({
          empname: data.empname || '',
          empphoto: data.empphoto || null,
          empemail: data.empemail || '',
          empphone: data.empphone || '',
        });
      }
    };

    fetchEmployerData();
  }, [session, user?.id]);

  useEffect(() => {
    if (!user) return;

    const fetchMyEvents = async () => {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('empid', user.id)
        .order('timecreated', { ascending: false });

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        return;
      }

      const eventsWithCounts = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { count: totalApplications } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('eventid', event.eventid);

          const { count: acceptedApplications } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('eventid', event.eventid)
            .eq('status', 'Accepted');

          const { count: underReviewApplications } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('eventid', event.eventid)
            .eq('status', 'Under Review');

          return {
            ...event,
            totalApplications: totalApplications || 0,
            acceptedApplications: acceptedApplications || 0,
            underReviewApplications: underReviewApplications || 0,
          };
        })
      );

      setMyEvents(eventsWithCounts);
    };

    fetchMyEvents();
  }, [user]);

  const handleSave = async () => {
    const { error } = await supabase
      .from('employers')
      .update({
        empname: employerData.empname,
        empemail: employerData.empemail,
        empphone: employerData.empphone,
      })
      .eq('empid', user.id);

    if (error) {
      setMessage({ type: 'error', text: 'Update failed!' });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleEventClick = (eventid) => {
    window.location.href = `/organiser/jobdesc?eventid=${eventid}`;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative">
      <div
        className="absolute inset-0 bg-cover bg-center z-[-1] opacity-60"
        style={{ backgroundImage: `url(${model3})` }}
      />
      <div className="max-w-5xl mx-auto">
        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-32 w-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-6xl">
              {employerData.empphoto ? (
                <img src={employerData.empphoto} className="h-full w-full object-cover rounded-full" alt="Employer" />
              ) : (
                <FaUser />
              )}
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
                  {employerData.empname || 'Complete your profile'}
                </h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center justify-center gap-1 text-white bg-[#56bb7c] px-4 py-2 rounded hover:bg-[#3E9B61]"
                >
                  <FaPen className="text-sm" /> {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="text-gray-600 mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <FaEnvelope />
                  {isEditing ? (
                    <input
                      type="email"
                      value={employerData.empemail}
                      onChange={(e) => setEmployerData({ ...employerData, empemail: e.target.value })}
                      className="border rounded px-2 py-1 w-full sm:w-auto"
                      placeholder="Email"
                    />
                  ) : (
                    <span>{employerData.empemail || 'Email not set'}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone />
                  {isEditing ? (
                    <input
                      type="text"
                      value={employerData.empphone}
                      onChange={(e) => setEmployerData({ ...employerData, empphone: e.target.value })}
                      className="border rounded px-2 py-1 w-full sm:w-auto"
                      placeholder="Phone number"
                    />
                  ) : (
                    <span>{employerData.empphone || 'Phone not set'}</span>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                    <input
                      type="text"
                      value={employerData.empname}
                      onChange={(e) => setEmployerData({ ...employerData, empname: e.target.value })}
                      className="border rounded px-3 py-2 w-full"
                      placeholder="Your name"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Listings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Listings</h2>
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
                    Date Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myEvents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      You have not created any events yet.
                    </td>
                  </tr>
                ) : (
                  myEvents.map((event) => (
                    <tr key={event.eventid}>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleEventClick(event.eventid)}
                          className="text-gray-800 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                        >
                          {event.eventname || 'Unknown'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{event.type || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(event.timecreated)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span className="font-medium">{event.totalApplications} Total</span>
                          <span className="text-xs text-blue-600">{event.underReviewApplications} Under Review</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            event.acceptedApplications >= (event.limit || 0)
                              ? 'bg-red-100 text-red-800'
                              : event.acceptedApplications > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {event.acceptedApplications}/{event.userslimit === 0 ? "No Limit" : event.userslimit}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
