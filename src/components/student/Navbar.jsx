import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMenu, IoClose } from "react-icons/io5";
import { FiChevronDown } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { UserAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  // State to track user photo URL
  const [userPhotoUrl, setUserPhotoUrl] = useState(null);

  useEffect(() => {
    const getUserPhoto = async () => {
      if (!session) return; // If no session, don't fetch photo
      
      const { data, error } = await supabase
        .from('users') // Ensure you're using the correct table
        .select('userphoto')
        .eq('userid', session.user.id)
        .single(); // Fetch single row by user ID

      if (error) {
        console.error('Error fetching user photo:', error);
        return;
      }
      
      setUserPhotoUrl(data?.userphoto || null); // Set user photo URL or null if not found
    };

    getUserPhoto(); // Call the function to fetch photo
    console.log(userPhotoUrl); // Will either log the userphoto URL or null if not found

  }, [session]); // Dependency on session so it refetches when the session changes

  // Toggle dropdown visibility
  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

  // Handle sign out
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='h-auto w-full bg-[#ecf1f4] lg:px-40 md:px-20 sm:px-10 px-4 py-4 flex items-center justify-between relative'>
      <Link to='/'>
        <h1 className='text-[#373354] font-bold text-2xl'>
          Opportuni<span className='text-[#ffa500] text-3xl'>U</span>
        </h1>
      </Link>
            {/* For debugging */}
      {console.log("Rendering with userPhotoUrl:", userPhotoUrl)}
      {userPhotoUrl && <div className="hidden">Photo URL exists: {userPhotoUrl}</div>}
      {/* Desktop Nav */}
      <ul className='hidden md:flex lg:gap-x-8 gap-x-4 text-sm items-center text-[#545859]'>
        <li className='hover:cursor-pointer hover:text-black duration-200'><Link to='/'>Home</Link></li>
        <li className='hover:cursor-pointer hover:text-black duration-200'><Link to='/joblistings'>Apply Now</Link></li>
        <li className='hover:cursor-pointer hover:text-black duration-200'><Link to='/aboutus'>About Us</Link></li>
        {session ? (
          <li className='relative flex items-center justify-center gap-x-4'>
              <button
                onClick={handleClick}
                className='text-[#373354] rounded-[4px] hover:underline duration-200 flex items-center justify-center gap-x-2 nav-dropdown'>
                {session?.user?.user_metadata?.fullname}
                <span className={`nav-dropdownicon ${showDropdown ? 'transform rotate-180' : ''}`}><FiChevronDown /></span>
              </button>

              {/* If showDropdown is true, show this div */}
              {showDropdown && (
                <div className="absolute left-0 top-[100%] w-40 bg-white border rounded-md shadow-md z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
              <Link to='/profile'>
                <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-lg">
                  {userPhotoUrl ? (
                    <img
                      src={userPhotoUrl}
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <FaUser />
                  )}
                </div>
              </Link>
          </li>
        ) : (
          <li>
            <Link to='/signin' className='text-white bg-[#56bb7c] px-8 py-2 rounded-[4px] hover:bg-[#3E9B61] duration-200'>
              Log In
            </Link>
          </li>
        )}
      </ul>

      {/* Mobile Menu Button */}
      <button className='md:hidden text-[#373354] text-2xl' onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <IoClose /> : <IoMenu />}
      </button>

      {/* Sidebar for Mobile */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-1/2 bg-[#ecf1f4] shadow-lg p-6 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <h1 className='text-[#373354] font-bold text-2xl mb-8'>
          Opportuni<span className='text-[#ffa500] text-3xl'>U</span>
        </h1>
        <ul className='flex flex-col gap-y-6 text-[#545859] text-base'>
          <li>
            <Link to='/profile'>
              <div className="h-20 w-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-lg -mb-2">
                {userPhotoUrl ? (
                  <img
                    src={userPhotoUrl}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <FaUser />
                )}
              </div>
            </Link>
          </li>
          <li className="relative">
            <button
              onClick={handleClick}
              className={`text-[#373354] rounded-[4px] hover:underline duration-200 items-center justify-center gap-x-2 nav-dropdown block ${!session ? 'hidden' : ''}`}>
              <Link to="/profile">
                {session?.user?.user_metadata?.fullname}
              </Link>
            </button>
          </li>
          <li onClick={() => setIsOpen(false)} className='hover:text-black cursor-pointer duration-200'><Link to='/'>Home</Link></li>
          <li onClick={() => setIsOpen(false)} className='hover:text-black cursor-pointer duration-200'><Link to='/joblistings'>Apply Now</Link></li>
          <li onClick={() => setIsOpen(false)} className='hover:text-black cursor-pointer duration-200 mb-2'><Link to='/aboutus'>About Us</Link></li>
          <li>
            {session ? (
              <button onClick={handleSignOut} >
                <Link to='/signin' className={`text-white bg-[#FF5B5B] px-8 py-2 rounded-[4px] hover:bg-[#DB0000] duration-200`}>
                  Sign Out
                </Link>
              </button>
            ) : (
              <Link to='/signin' className='text-white bg-[#56bb7c] px-8 py-2 rounded-[4px] hover:bg-[#3E9B61] duration-200'>
                Log In
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
