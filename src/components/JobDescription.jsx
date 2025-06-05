import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../supabaseClient';


const JobDescription = () => {
  const [searchParams] = useSearchParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const eventId = searchParams.get('eventid');

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('eventid', eventId)
        .single();

      if (!error) {
        setEvent(data);
      }
      setLoading(false);
    };

    if (eventId) fetchEvent();
  }, [eventId]);

  if (loading) {
    return <div className="text-center mt-20 text-[#373354]">Loading...</div>;
  }

  if (!event) {
    return <div className="text-center mt-20 text-red-500">Event not found.</div>;
  }

  return (
    <div className='w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 py-24 bg-[#ecf1f4] text-[#373354]'>
      <h1 className='text-2xl sm:text-3xl font-semibold mb-6'>{event.eventname}</h1>
      <p className='text-[#909596] text-sm sm:text-base mb-2'>
        Location: <span className='font-medium'>{event.location}</span>
      </p>
      <p className='text-[#909596] text-sm sm:text-base mb-2'>
        Type: <span className='text-[#FA5C00]'>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
      </p>
      {event.pay && (
        <p className='text-[#909596] text-sm sm:text-base mb-2'>
          Pay: <span className='font-medium text-[#FA5C00]'>RM {event.pay.toFixed(2)}</span>
        </p>
      )}
      <p className='text-[#909596] text-sm sm:text-base mb-2'>
        Slots: <span className='font-medium'>{event.userslimit}</span>
      </p>
      <p className='text-[#909596] text-sm sm:text-base mb-2'>
        Posted: <span className='font-medium'>{formatDistanceToNow(new Date(event.timecreated), { addSuffix: true })}</span>
      </p>

      <div className='w-full h-[1px] bg-gray-300 my-6'></div>

      <div className='bg-white p-5 sm:p-6 rounded-lg shadow'>
        <h2 className='text-lg font-semibold mb-3'>Description</h2>
        <p className='text-sm sm:text-base leading-relaxed'>{event.description}</p>
      </div>

      {event.link && (
        <div className='mt-6'>
          <a
            href={event.link}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-block px-6 py-2 rounded-md bg-[#56bb7c] hover:bg-[#3E9B61] text-white text-sm sm:text-base transition duration-200'
          >
            Apply Now
          </a>
        </div>
      )}
    </div>
  );
};

export default JobDescription;
