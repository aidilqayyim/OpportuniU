import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '../../supabaseClient';

const JobDescription = () => {
  const [searchParams] = useSearchParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    eventname: '',
    description: '',
    location: '',
    type: '',
    eventdate: '',
    pay: '',
    userslimit: 0,
    link: '',
    merit: false,
  });
  const eventId = searchParams.get('eventid');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, employers(*)')
        .eq('eventid', eventId)
        .single();

      if (!error) {
        setEvent(data);
        // Initialize form data
        const formattedDate = data.eventdate 
          ? new Date(data.eventdate).toISOString().split('T')[0] 
          : '';
        
        setFormData({
          eventname: data.eventname || '',
          description: data.description || '',
          location: data.location || '',
          type: data.type || '',
          eventdate: formattedDate,
          pay: data.pay || '',
          userslimit: data.userslimit || 0,
          link: data.link || '',
          merit: data.merit || false,
        });
      }
      setLoading(false);
    };

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    if (eventId) fetchEvent();
    fetchUser();
  }, [eventId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original event data
    if (event) {
      const formattedDate = event.eventdate 
        ? new Date(event.eventdate).toISOString().split('T')[0] 
        : '';
      
      setFormData({
        eventname: event.eventname || '',
        description: event.description || '',
        location: event.location || '',
        type: event.type || '',
        eventdate: formattedDate,
        pay: event.pay || '',
        userslimit: event.userslimit || 0,
        link: event.link || '',
        merit: event.merit || false,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!user) {
      alert("You must be logged in.");
      setSubmitting(false);
      return;
    }

    // Fetch organiser's employerid to verify they own this event
    const { data: employer, error } = await supabase
      .from('employers')
      .select('empid')
      .eq('empemail', user.email)
      .maybeSingle();

    if (error || !employer) {
      alert("You're not registered as an organiser.");
      setSubmitting(false);
      return;
    }

    // Verify the event belongs to this employer
    const { data: eventCheck, error: eventError } = await supabase
      .from('events')
      .select('empid')
      .eq('eventid', eventId)
      .single();

    if (eventError || !eventCheck || eventCheck.empid !== employer.empid) {
      alert("You don't have permission to edit this event.");
      setSubmitting(false);
      return;
    }

    // Update the event
    const { error: updateError } = await supabase
      .from('events')
      .update(formData)
      .eq('eventid', eventId);

    if (updateError) {
      alert("Failed to update event: " + updateError.message);
    } else {
      alert("Event updated successfully!");
      // Refresh the event data
      const { data } = await supabase
        .from('events')
        .select('*, employers(*)')
        .eq('eventid', eventId)
        .single();
      
      if (data) {
        setEvent(data);
      }
      setIsEditing(false);
    }

    setSubmitting(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    
    try {
      // First delete related applications
      const { error: applicationsError } = await supabase
        .from('applications')
        .delete()
        .eq('eventid', eventId);

      if (applicationsError) {
        throw applicationsError;
      }

      // Then delete the event
      const { error: eventError } = await supabase
        .from('events')
        .delete()
        .eq('eventid', eventId);

      if (eventError) {
        throw eventError;
      }

      alert('Event deleted successfully!');
      navigate('/dashboard'); // Navigate back to dashboard or events list
    } catch (error) {
      console.error('Error deleting event:', error.message);
      alert('Failed to delete event. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Check if the selected type should show pay input
  const shouldShowPay = ['Full-Time', 'Part-Time', 'One-Time'].includes(formData.type);

  if (loading) {
    return <div className="text-center mt-20 text-[#373354]">Loading...</div>;
  }

  if (!event) {
    return <div className="text-center mt-20 text-red-500">Event not found.</div>;
  }

  // Edit Mode Layout
  if (isEditing) {
    return (
      <div className='w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 py-12 bg-white'>
        <h1 className='text-[#373354] font-semibold text-3xl mb-6'>Edit Event</h1>
        
        <form onSubmit={handleUpdateSubmit} className="space-y-6">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-[#373354] mb-2">
              Event Name *
            </label>
            <input 
              name="eventname" 
              placeholder="Enter event name" 
              value={formData.eventname} 
              onChange={handleChange} 
              required 
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56bb7c] focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#373354] mb-2">
              Description *
            </label>
            <textarea 
              name="description" 
              placeholder="Describe the opportunity, requirements, and expectations" 
              value={formData.description} 
              onChange={handleChange} 
              required 
              rows="6"
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56bb7c] focus:border-transparent resize-vertical"
            />
          </div>

          {/* Location and Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#373354] mb-2">
                Location *
              </label>
              <input 
                name="location" 
                placeholder="Enter location" 
                value={formData.location} 
                onChange={handleChange} 
                required 
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56bb7c] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#373354] mb-2">
                Type *
              </label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange} 
                required 
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56bb7c] focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="One-Time">One-Time</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Program">Program</option>
                <option value="Workshop">Workshop</option>
                <option value="Competition">Competition</option>
              </select>
            </div>
          </div>

          {/* Event Date and Pay/Merit Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#373354] mb-2">
                Event Date *
              </label>
              <input 
                type="date" 
                name="eventdate" 
                value={formData.eventdate} 
                onChange={handleChange} 
                required 
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56bb7c] focus:border-transparent"
              />
            </div>

            <div>
              {shouldShowPay ? (
                <>
                  <label className="block text-sm font-medium text-[#373354] mb-2">
                    Pay (RM)
                  </label>
                  <input 
                    type="text" 
                    name="pay" 
                    placeholder="Enter pay amount" 
                    value={formData.pay} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56bb7c] focus:border-transparent"
                  />
                </>
              ) : (
                <div className="flex items-center h-full">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="merit" 
                      checked={formData.merit} 
                      onChange={handleChange}
                      className="w-4 h-4 text-[#56bb7c] border-gray-300 rounded focus:ring-[#56bb7c]"
                    />
                    <span className="text-sm font-medium text-[#373354]">Merit Provided</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* User Limit and Link Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#373354] mb-2">
                User Limit
              </label>
              <input 
                type="number" 
                name="userslimit" 
                placeholder="Maximum participants" 
                value={formData.userslimit} 
                onChange={handleChange} 
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56bb7c] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#373354] mb-2">
                Additional Link (Optional)
              </label>
              <input 
                name="link" 
                placeholder="Website, application form, etc." 
                value={formData.link} 
                onChange={handleChange} 
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56bb7c] focus:border-transparent"
              />
            </div>
          </div>

          <div className='w-full h-[1px] bg-gray-300 my-8'></div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button 
              type="button"
              onClick={handleCancelEdit}
              disabled={submitting}
              className="bg-gray-500 text-white px-8 py-3 rounded-md hover:bg-gray-600 transition duration-200 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-[#56bb7c] text-white px-8 py-3 rounded-md hover:bg-[#3E9B61] transition duration-200 font-medium disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // View Mode Layout (Original)
  return (
    <div className='w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 py-12 bg-white'>
      <h1 className='text-[#373354] font-semibold text-3xl'>{event.eventname}</h1>
      <p className='text-[#373737] mt-5'>By {event.employers?.empname || 'Unknown employer'}</p>
      <p className='text-[#373737] mt-2'>
        {event.location}
        <span> • {event.type}</span>
      </p>

      <div className='w-full h-[1px] bg-gray-300 my-6'></div>

      <div className='flex flex-col gap-3 text-sm sm:text-base text-[#373737] mb-6'>
        <div><strong>Event Date :</strong> {event.eventdate ? format(new Date(event.eventdate), 'dd/MM/yyyy') : 'TBA'}</div>
        <div>
          {
            (event.type.toLowerCase() === 'part-time' || event.type.toLowerCase() === 'full-time') 
            ? <><strong>Pay :</strong> {(!event.pay || event.pay === '0') ? 'Not specified' : 'RM ' + event.pay}</>
            : <><strong>Merit :</strong> {(event.merit === true) ? 'Merit provided' : 'No Merit provided'}</>
          }
        </div>
        <div><strong>User Limit :</strong> {event.userslimit || 'Not specified'}</div>
        <div><strong>Job Link :</strong> {event.link ? <a href={event.link} target='_blank' rel='noopener noreferrer' className='text-blue-600 underline'>{event.link}</a> : 'Not provided'}</div>
      </div>

      <div className='bg-white p-5 sm:p-6 rounded-lg shadow'>
        <h2 className='text-lg font-semibold mb-3'>Description</h2>
        <p className='text-sm sm:text-base leading-relaxed'>{event.description}</p>
      </div>

      <div className='mt-6 flex gap-4 flex-wrap justify-between'>
        <div>
            <button
            onClick={() => navigate(`/organiser/checkapplications?eventid=${eventId}`)}
            className='inline-block px-6 py-2 rounded-md bg-green-600 hover:bg-green-800 text-white text-sm sm:text-base transition duration-200'
            >
            Check Applications
            </button>
        </div>
        
        <div>
            <button
            onClick={handleEditClick}
            className='inline-block px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base transition duration-200 mr-4'
            >
            Edit
            </button>
            
            <button
            onClick={handleDeleteClick}
            className='inline-block px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base transition duration-200'
            >
            Delete
            </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4'>
            <h3 className='text-lg font-semibold mb-4 text-[#373354]'>Confirm Delete</h3>
            <p className='text-[#373737] mb-6'>
              Are you sure you want to delete this event? This action cannot be undone and will also delete all related applications.
            </p>
            <div className='flex gap-4 justify-end'>
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className='px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md transition duration-200 disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-200 disabled:opacity-50'
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDescription;