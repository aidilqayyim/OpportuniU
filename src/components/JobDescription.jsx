import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '../supabaseClient';

const JobDescription = () => {
  const [searchParams] = useSearchParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
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
      }
      setLoading(false);
    };

    const fetchUserAndCheckApplication = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user && eventId) {
        const { data: applications, error } = await supabase
          .from('applications')
          .select('*')
          .eq('userid', user.id)
          .eq('eventid', eventId);

        if (applications && applications.length > 0) {
          setHasApplied(true);
        }
      }
    };

    if (eventId) fetchEvent();
    fetchUserAndCheckApplication();
  }, [eventId]);

  const handleApplyClick = async () => {
  if (!user) {
    navigate('/signin');
    return;
  }

  const now = new Date();
  const malaysiaOffset = 8 * 60; // MYT UTC+8 in minutes
  const localOffset = now.getTimezoneOffset();
  const malaysiaTime = new Date(now.getTime() + (malaysiaOffset + localOffset) * 60000);

  const year = malaysiaTime.getFullYear();
  const month = String(malaysiaTime.getMonth() + 1).padStart(2, '0');
  const day = String(malaysiaTime.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const { data, error } = await supabase.from('applications').insert([
    {
      userid: user.id,
      eventid: event.eventid,
      status: 'Under Review',
      dateapplied: formattedDate,
    },
  ]);

  if (error) {
    console.error('Error inserting application:', error.message);
    alert('Failed to apply. Please try again.');
  } else {
    alert('Application submitted successfully!');
    setHasApplied(true);
  }
};


  if (loading) {
    return <div className="text-center mt-20 text-[#373354]">Loading...</div>;
  }

  if (!event) {
    return <div className="text-center mt-20 text-red-500">Event not found.</div>;
  }
  

  return (
    <div className='w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 py-24 bg-white'>
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

      <div className='mt-6'>
        <button
          onClick={handleApplyClick}
          disabled={hasApplied}
          className={`inline-block px-6 py-2 rounded-md text-white text-sm sm:text-base transition duration-200 ${
            hasApplied
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#56bb7c] hover:bg-[#3E9B61]'
          }`}
        >
          {hasApplied ? '✓ Applied' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
};

export default JobDescription;
