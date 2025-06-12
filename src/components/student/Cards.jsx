import React, { useEffect, useState } from 'react';
import { FaArrowRight } from "react-icons/fa6";
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';

// Helper: Capitalize first letter
const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Helper: relative time from timestamp
const getRelativeTime = (timestamp) => {
  if (!timestamp) return 'Date not set';
  const eventDate = new Date(timestamp);
  const now = new Date();
  const diffMs = now - eventDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  const futureDays = Math.abs(diffDays);
  return `in ${futureDays} day${futureDays > 1 ? 's' : ''}`;
};

const Cards = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchLatestEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('timecreated', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching events:', error);
        return;
      }
      setEvents(data);
    };

    fetchLatestEvents();
  }, []);

  return (
    <div>
      <div className='w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 py-24 flex flex-col bg-[#ecf1f4] text-[#373354]'>
        <h1 className='font-semibold text-xl sm:text-2xl lg:text-3xl mb-8'>
          Latest <span className='text-[#56bb7c]'>Job/Program</span> Listings
        </h1>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-5'>
          {events.map((event) => (
            <div key={event.eventid} className='bg-white hover:bg-[#373354] hover:text-white shadow-lg rounded-lg px-4 sm:px-5 py-4 sm:py-5 duration-200 text-sm sm:text-base'>
              <p className='text-[#909596] font-medium truncate text-xs sm:text-sm'>{event.location}</p>
              <h1 className='font-medium truncate text-sm sm:text-base'>{event.eventname}</h1>
              <div className='flex items-center justify-between'>
                <p className='text-[#909596] mt-2 text-xs'>{getRelativeTime(event.timecreated)}</p>
                <div className='bg-[#fff8f4] w-[70px] h-[24px] rounded-sm text-[10px] sm:text-xs flex justify-center items-center text-[#FA5C00]'>
                  {capitalizeFirst(event.type)}
                </div>
              </div>
              <p className='mt-3 text-[#909596] h-[60px] sm:h-[70px] text-[11px] sm:text-sm overflow-hidden card-desc'>
                {event.description.length > 100
                  ? event.description.slice(0, 100) + '...'
                  : event.description}
              </p>
              <Link
                to={`/jobdesc?eventid=${event.eventid}`}
                className='mt-3 bg-[#E7F5ED] hover:bg-[#56bb7c] hover:text-white w-[80px] h-[28px] sm:w-[85px] sm:h-[30px] duration-200 rounded-sm text-[11px] sm:text-xs flex justify-center items-center text-[#2D7147] font-medium cursor-pointer text-center'
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>
        <div className='flex w-full h-auto items-center justify-center'>
          <Link to="/joblistings" className='h-10 sm:h-12 bg-transparent rounded-md px-4  hover:bg-[#56bb7c] hover:text-white text-[#56bb7c] border-[#56bb7c] border-2 duration-200 flex items-center justify-center gap-x-2 mt-10 font-medium'>
            Browse more<span className='text-lg'><FaArrowRight /></span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cards;
