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
    userslimit: '',
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
      navigate('/organiser/'); // or wherever you want to redirect
    }
  };

  return (
    
    <div className="max-w-2xl mx-auto p-8 bg-white shadow rounded mt-10">
      <h1 className="text-2xl font-semibold mb-6 text-[#373354]">Add New Job</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="eventname" placeholder="Event Name" value={formData.eventname} onChange={handleChange} required className="border p-2 rounded" />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="border p-2 rounded" />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required className="border p-2 rounded" />
        
        <select name="type" value={formData.type} onChange={handleChange} required className="border p-2 rounded">
          <option value="">Select Type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Volunteer">Volunteer</option>
        </select>

        <input type="date" name="eventdate" value={formData.eventdate} onChange={handleChange} required className="border p-2 rounded" />
        <input type="number" name="pay" placeholder="Pay (RM)" value={formData.pay} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="userslimit" placeholder="User Limit" value={formData.userslimit} onChange={handleChange} className="border p-2 rounded" />
        <input name="link" placeholder="Job Link (optional)" value={formData.link} onChange={handleChange} className="border p-2 rounded" />

        <label className="flex items-center gap-2">
          <input type="checkbox" name="merit" checked={formData.merit} onChange={handleChange} />
          Provide Merit?
        </label>

        <button type="submit" className="bg-[#56bb7c] text-white py-2 rounded hover:bg-[#3E9B61]">
          Submit Job
        </button>
      </form>
    </div>
  );
};

export default AddJobs;
