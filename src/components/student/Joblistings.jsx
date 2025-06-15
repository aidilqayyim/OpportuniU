import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { supabase } from '../../supabaseClient';

const Joblistings = () => {
  const [searchParams] = useSearchParams();
  const initialKeywords = searchParams.get('keywords') || '';

  const [keywords, setKeywords] = useState(initialKeywords);
  const [sortBy, setSortBy] = useState('relevance');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

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

  const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const fetchEvents = async () => {
    setLoading(true);

    try {
      let query = supabase
        .from('events')
        .select('*', { count: 'exact' })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (keywords.trim() !== '') {
        query = query.ilike('eventname', `%${keywords.trim()}%`);
      }

      if (type.toLowerCase() !== 'all') {
        const typeMapping = {
          'part-time': 'Part-Time',
          'full-time': 'Full-Time',
          'one-time': 'One-Time',
          'program': 'Program',
          'volunteer': 'Volunteer',
          'competition': 'Competition',
          'workshop': 'Workshop'
        };
        const mappedType = typeMapping[type.toLowerCase()] || capitalizeFirstLetter(type);
        query = query.ilike('type', mappedType);
      }

      if (sortBy === 'newest') {
        query = query.order('timecreated', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('timecreated', { ascending: true });
      } else {
        query = query.order('eventdate', { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setTotalPages(1);
      } else {
        setEvents(data || []);
        setTotalPages(count ? Math.ceil(count / pageSize) : 1);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setEvents([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  const handleSortClick = () => {
    setPage(1);
    fetchEvents();
  };

  useEffect(() => {
    if (initialKeywords.trim() !== '') {
      fetchEvents();
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [page, type, sortBy]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div>
      {/* Search Bar */}
      <div className='bg-[#ecf1f4] w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 pb-8 pt-4 flex justify-between'>
        <form onSubmit={handleSearch} className='w-full flex flex-col md:flex-row items-start md:items-center gap-4'>
          <div className='flex flex-col w-full md:w-[40%]'>
            <label htmlFor="keywords" className='text-[#373354] font-medium text-lg'>Keywords</label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter keywords"
              className='my-1 h-11 px-4 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#56bb7c]'
            />
          </div>
          <div className='flex flex-col w-full md:w-[30%]'>
            <label htmlFor="type" className='text-[#373354] font-medium text-lg'>Type</label>
            <div className="relative">
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="my-1 h-11 w-full px-5 pr-10 rounded-md border border-gray-300 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#56bb7c]"
              >
                <option value="all">All</option>
                <option value="part-time">Part-Time</option>
                <option value="full-time">Full-Time</option>
                <option value="one-time">One-Time</option>
                <option value="program">Program</option>
                <option value="volunteer">Volunteer</option>
                <option value="competition">Competition</option>
                <option value="workshop">Workshop</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <div className='flex w-full md:w-[30%] justify-start md:pl-10'>
            <button
              type="submit"
              className='w-full md:w-[40%] text-white bg-[#56bb7c] px-6 py-2 rounded-[4px] hover:bg-[#3E9B61] duration-200 focus:outline-none focus:ring-2 focus:ring-[#56bb7c] focus:ring-offset-2'
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className='w-full h-auto bg-white lg:px-40 md:px-20 sm:px-10 px-4 py-8 flex flex-col items-center'>
        <div className='w-full h-auto'>
          <h1 className='font-semibold text-[#373354] text-2xl mb-3'>Jobs/Program Listing</h1>
        </div>

        <div className='flex flex-col lg:flex-row w-full h-auto gap-6'>
          {/* Listings */}
          <div className='flex flex-col flex-1 gap-y-4'>
            <div className="w-full h-[1px] bg-gray-300 self-stretch mb-2"></div>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-[#373354]">Loading...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-[#909596]">No results found.</p>
              </div>
            ) : (
              events.map((event) => (
                <Link
                  to={`/jobdesc?eventid=${event.eventid}`}
                  key={event.eventid}
                  className='bg-transparent hover:bg-[#373354] hover:text-white text-[#373354] rounded-lg px-4 py-4 duration-200 text-sm sm:text-base w-full cursor-pointer border-[3px] border-gray-200 hover:border-[#373354]'
                >
                  <div className='flex flex-col gap-y-2'>
                    <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-y-2'>
                      <p className='text-[#909596] font-medium text-base sm:text-lg flex-shrink-0'>
                        {event.location || 'Location not specified'}
                      </p>
                      <div className='flex gap-x-2 flex-wrap justify-start sm:justify-end'>
                        {(event.type?.toLowerCase() === 'part-time' || event.type?.toLowerCase() === 'full-time') && event.pay && (
                          <div className='bg-[#fff8f4] h-[30px] rounded-sm text-sm flex items-center text-[#FA5C00] px-2 whitespace-nowrap'>
                            RM {event.pay}
                          </div>
                        )}
                        {event.type?.toLowerCase() !== 'part-time' && event.type?.toLowerCase() !== 'full-time' && (
                          <div className='bg-[#fff8f4] h-[30px] rounded-sm text-sm flex items-center text-[#FA5C00] px-2 whitespace-nowrap'>
                            {event.merit ? 'Merit Provided' : 'Merit Not Provided'}
                          </div>
                        )}
                        {event.type && (
                          <div className='bg-[#fff8f4] h-[30px] rounded-sm text-sm flex items-center text-[#FA5C00] px-2 whitespace-nowrap'>
                            {capitalizeFirstLetter(event.type)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <h1 className='font-semibold text-xl sm:text-2xl mt-2 line-clamp-2'>
                    {event.eventname || 'Event name not available'}
                  </h1>
                  <p className='text-[#909596] mt-2 sm:text-base text-xs'>
                    {getRelativeTime(event.timecreated)}
                  </p>
                  <p className='mt-3 text-[11px] sm:text-sm text-gray-700 line-clamp-3'>
                    {event.description || 'No description available'}
                  </p>
                </Link>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:block lg:w-[20%] w-full">
            <p className='text-[#909596]'>SORT BY</p>
            <div className='w-full bg-gray-300 h-[1.2px] my-3'></div>
            <div className='flex flex-col gap-y-3'>
              {['relevance', 'newest', 'oldest'].map(option => (
                <label key={option} className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sortby"
                    value={option}
                    checked={sortBy === option}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="form-radio text-[#56bb7c] focus:ring-[#56bb7c]"
                  />
                  <span className="capitalize">{option}</span>
                </label>
              ))}
              <div className='w-full flex items-center justify-center'>
                <button
                  type="button"
                  onClick={handleSortClick}
                  className="mt-4 bg-[#56bb7c] text-white py-2 w-[50%] rounded-md hover:bg-[#3E9B61] duration-200 focus:outline-none focus:ring-2 focus:ring-[#56bb7c] focus:ring-offset-2"
                >
                  Sort
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex flex-col sm:flex-row gap-y-4 sm:gap-x-5 w-full items-center justify-center mt-10'>
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`h-10 sm:h-12 rounded-md px-4 flex items-center justify-center font-medium transition-all duration-200
                ${page === 1 
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                  : 'bg-transparent text-[#56bb7c] border-[#56bb7c] border-2 hover:bg-[#56bb7c] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#56bb7c] focus:ring-offset-2'
                }`}
            >
              <FaArrowLeft className="mr-2" /> Previous
            </button>
            <span className='text-[#373354] font-semibold'>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`h-10 sm:h-12 rounded-md px-4 flex items-center justify-center font-medium transition-all duration-200
                ${page === totalPages 
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                  : 'bg-transparent text-[#56bb7c] border-[#56bb7c] border-2 hover:bg-[#56bb7c] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#56bb7c] focus:ring-offset-2'
                }`}
            >
              Next <FaArrowRight className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Joblistings;
