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

  try {
    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (keywords.trim() !== '') {
      query = query.ilike('eventname', `%${keywords.trim()}%`);
    }

    const normalizedType = type.toLowerCase();
    if (
      normalizedType &&
      normalizedType !== 'both' &&
      normalizedType !== 'job'
    ) {
      query = query.ilike('type', capitalizeFirstLetter(normalizedType));
    } else if (normalizedType === 'job') {
      // Show all job types
      query = query.in('type', ['Full-Time', 'Part-Time', 'One-Time']);
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

  const handleSortClick = () => {
    setPage(1);
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, [page]);

  useEffect(() => {
    if (initialKeywords) {
      fetchEvents();
    }
  }, [initialKeywords]);

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
                <option value="both">All</option>
                <option value="program">Program</option>
                <option value="job">Job (Full-time / Part-time / One-time)</option>
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="one-time">One-Time</option>
                <option value="volunteer">Volunteer</option>
                <option value="workshop">Workshop</option>
                <option value="competition">Competition</option>
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
      {/* Listing and Pagination remains unchanged... */}
    </div>
  );
};

export default Joblistings;