import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft} from "react-icons/fa6";
import { BsPlusCircleDotted } from "react-icons/bs";
import { supabase } from '../../supabaseClient';

const MyListings = () => {
  const [searchParams] = useSearchParams();
  const initialKeywords = searchParams.get('keywords') || '';
  const navigate = useNavigate();

  const [keywords, setKeywords] = useState(initialKeywords);
  const [sortBy, setSortBy] = useState('relevance');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('both');
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

    // ✅ Get current user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error getting user or not logged in:', userError);
      setEvents([]);
      setLoading(false);
      navigate('/signin');
      return;
    }

    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .eq('empid', user.id) // ✅ Filter by empid
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (keywords.trim() !== '') {
      query = query.ilike('eventname', `%${keywords.trim()}%`);
    }

    if (type.toLowerCase() === 'program') {
      query = query.ilike('type', 'program');
    } else if (type.toLowerCase() === 'job') {
      query = query.or('type.ilike.part-time,type.ilike.full-time');
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

    setLoading(false);
  };

  const handleSortClick = () => {
    setPage(1);
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div>
      <div className='w-full h-auto bg-white lg:px-40 md:px-20 sm:px-10 px-4 py-8 flex flex-col items-center'>
        <div className='w-full h-auto'>
          <h1 className='font-semibold text-[#373354] text-2xl mb-3'>My Listing(s)</h1>
        </div>

        <div className='flex flex-col lg:flex-row w-full h-auto gap-6'>
          <div className='flex flex-col flex-1 gap-y-4'>
            <div className="w-full h-[1px] bg-gray-300 self-stretch mb-2"></div>
            {loading && <p>Loading...</p>}
            <Link to="/organiser/addjobs" className='flex items-center justify-center bg-transparent hover:bg-[#373354] hover:text-white text-[#373354] rounded-lg px-4 py-8 duration-200 text-sm sm:text-base w-full cursor-pointer border-[3px] hover:border-[#373354]'>
                <BsPlusCircleDotted className='text-[50px]' />
            </Link>
            {!loading && events.map((event) => (
              <Link
                to={`/organiser/jobdesc?eventid=${event.eventid}`}
                key={event.eventid}
                className='bg-transparent hover:bg-[#373354] hover:text-white text-[#373354] rounded-lg px-4 py-4 duration-200 text-sm sm:text-base w-full cursor-pointer border-[3px] hover:border-[#373354]'
              >
                <div className='flex flex-col sm:flex-row justify-between gap-y-2'>
                  <p className='text-[#909596] font-medium truncate text-base sm:text-lg'>{event.location}</p>
                  <div className='flex gap-x-2 flex-wrap sm:flex-nowrap mb-2'>
                    {(event.type.toLowerCase() === 'part-time' || event.type.toLowerCase() === 'full-time') ? (
                      event.pay && (
                        <div className='bg-[#fff8f4] h-[30px] rounded-sm text-sm flex items-center text-[#FA5C00] px-2'>
                          RM {event.pay}
                        </div>
                      )
                    ) : (
                      <div className='bg-[#fff8f4] h-[30px] rounded-sm text-sm flex items-center text-[#FA5C00] px-2'>
                        {event.merit ? 'Merit Provided' : 'Merit Not Provided'}
                      </div>
                    )}
                    <div className='bg-[#fff8f4] h-[30px] rounded-sm text-sm flex items-center text-[#FA5C00] px-2'>
                      {capitalizeFirstLetter(event.type)}
                    </div>
                  </div>
                </div>
                <h1 className='font-semibold truncate text-xl sm:text-2xl'>{event.eventname}</h1>
                <p className='text-[#909596] mt-2 sm:text-base text-xs'>{getRelativeTime(event.timecreated)}</p>
                <p className='mt-3 h-[60px] sm:h-[70px] text-[11px] sm:text-sm overflow-hidden card-desc'>
                  {event.description.length > 300
                    ? event.description.slice(0, 300) + '...'
                    : event.description
                  }
                </p>
              </Link>
            ))}
          </div>

          {/* Sidebar Filter */}
          <div className="lg:block lg:w-[20%] w-full">
            <p className='text-[#909596]'>SORT BY</p>
            <div className='w-full bg-gray-300 h-[1.2px] my-3'></div>
            <form className='flex flex-col gap-y-3'>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="sortby"
                  value="newest"
                  className="form-radio text-blue-600"
                  checked={sortBy === 'newest'}
                  onChange={(e) => setSortBy(e.target.value)}
                />
                <span>Newest</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="sortby"
                  value="oldest"
                  className="form-radio text-blue-600"
                  checked={sortBy === 'oldest'}
                  onChange={(e) => setSortBy(e.target.value)}
                />
                <span>Oldest</span>
              </label>
              <div className='w-full flex items-center justify-center'>
                <button
                  type="button"
                  onClick={handleSortClick}
                  className="mt-4 bg-[#56bb7c] text-white py-2 w-[50%] rounded-md hover:bg-[#3E9B61] duration-200"
                >
                  Sort
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Pagination */}
        <div className='flex flex-col sm:flex-row gap-y-4 sm:gap-x-5 w-full items-center justify-center mt-10'>
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className={`h-10 sm:h-12 rounded-md px-4 flex items-center justify-center font-medium
              ${page === 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-transparent text-[#56bb7c] border-[#56bb7c] border-2 hover:bg-[#56bb7c] hover:text-white duration-200'}`}
          >
            <FaArrowLeft className="mr-2" /> Previous
          </button>
          <span className='text-[#373354] font-semibold'>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className={`h-10 sm:h-12 rounded-md px-4 flex items-center justify-center font-medium
              ${page === totalPages ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-transparent text-[#56bb7c] border-[#56bb7c] border-2 hover:bg-[#56bb7c] hover:text-white duration-200'}`}
          >
            Next <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyListings;
