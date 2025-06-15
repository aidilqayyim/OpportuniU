import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '../../supabaseClient';

const CheckApplications = () => {
  const [searchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const eventId = searchParams.get('eventid');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchEventAndApplications = async () => {
      if (!eventId) {
        alert('No event ID provided');
        navigate('/organiser/mylistings');
        return;
      }

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*, employers(*)')
        .eq('eventid', eventId)
        .single();

      if (eventError || !eventData) {
        alert('Event not found');
        navigate('/organiser/mylistings');
        return;
      }

      setEvent(eventData);

      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          users (
            userid,
            username,
            userphoto,
            userfaculty,
            usercourse
          )
        `)
        .eq('eventid', eventId)
        .order('dateapplied', { ascending: false });

      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError);
        alert('Failed to fetch applications');
      } else {
        setApplications(applicationsData || []);
      }

      setLoading(false);
    };

    fetchEventAndApplications();
  }, [eventId, navigate]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [applicationId]: true }));

    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('applicationid', applicationId);

      if (error) {
        throw error;
      }

      setApplications(prev => 
        prev.map(app => 
          app.applicationid === applicationId 
            ? { ...app, status: newStatus }
            : app
        )
      );

      alert(`Application ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update application status');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'under review':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderActionButtons = (application) => {
    const isUpdating = updatingStatus[application.applicationid];
    const status = application.status.toLowerCase();

    if (status === 'accepted') {
      return (
        <div className="flex gap-2">
          <button
            disabled
            className="px-3 py-1 bg-green-200 text-green-800 rounded text-sm cursor-not-allowed"
          >
            Accepted
          </button>
          <button
            onClick={() => handleStatusUpdate(application.applicationid, 'Rejected')}
            disabled={isUpdating}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition duration-200 disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Reject'}
          </button>
        </div>
      );
    }

    if (status === 'rejected') {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleStatusUpdate(application.applicationid, 'Accepted')}
            disabled={isUpdating}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition duration-200 disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Accept'}
          </button>
          <button
            disabled
            className="px-3 py-1 bg-red-200 text-red-800 rounded text-sm cursor-not-allowed"
          >
            Rejected
          </button>
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleStatusUpdate(application.applicationid, 'Accepted')}
          disabled={isUpdating}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition duration-200 disabled:opacity-50"
        >
          {isUpdating ? 'Updating...' : 'Accept'}
        </button>
        <button
          onClick={() => handleStatusUpdate(application.applicationid, 'Rejected')}
          disabled={isUpdating}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition duration-200 disabled:opacity-50"
        >
          {isUpdating ? 'Updating...' : 'Reject'}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className='w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 py-24 bg-white'>
        <div className="text-center mt-20 text-[#373354]">Loading applications...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className='w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 py-24 bg-white'>
        <div className="text-center mt-20 text-red-500">Event not found.</div>
      </div>
    );
  }

  return (
    <div className='w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 py-24 bg-white'>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className='text-[#373354] font-semibold text-3xl'>Event Applications</h1>
          <p className='text-[#373737] mt-2'>{event.eventname}</p>
          <p className='text-[#373737] text-sm mt-1'>
            Total Applications: <span className="font-semibold ">{applications.length}</span>
          </p>
        </div>
      </div>

      <div className='w-full h-[1px] bg-gray-300 mb-6'></div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#373737] text-lg">No applications received yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <tr key={application.applicationid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {application.users?.userphoto ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={application.users.userphoto}
                            alt={application.users.username || 'User'}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {application.users?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <Link
                          to={`/organiser/applicantsprofile?userid=${application.users?.userid}`}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {application.users?.username || 'Unknown User'}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.users?.userfaculty || 'Not specified'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.users?.usercourse || 'Not specified'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.dateapplied ? format(new Date(application.dateapplied), 'dd/MM/yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderActionButtons(application)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CheckApplications;
