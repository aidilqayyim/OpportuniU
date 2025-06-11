import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const AddJobs = () => {
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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    // Fetch organiser's employerid
    const { data: employer, error } = await supabase
      .from('employers')
      .select('empid')
      .eq('empemail', user.email)
      .maybeSingle();

    if (error || !employer) {
      alert("You're not registered as an organiser.");
      return;
    }

    const { error: insertError } = await supabase
      .from('events')
      .insert([
        {
          ...formData,
          empid: employer.empid
        }
      ]);

    if (insertError) {
      alert("Failed to add job: " + insertError.message);
    } else {
      alert("Job added successfully!");
      navigate('/organiser/mylistings'); // or wherever you want to redirect
    }
  };

  // Check if the selected type should show pay input
  const shouldShowPay = ['Full-Time', 'Part-Time', 'One-Time'].includes(formData.type);

  return (
    <div className='w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 py-10 bg-white'>
      <h1 className='text-[#373354] font-semibold text-3xl mb-6'>Create New Event</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="bg-[#56bb7c] text-white px-8 py-3 rounded-md hover:bg-[#3E9B61] transition duration-200 font-medium"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJobs;