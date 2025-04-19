import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMenu, IoClose } from "react-icons/io5";
import { FiChevronDown } from 'react-icons/fi';
import { UserAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  // State to track if the button is pressed
  const [isPressed, setIsPressed] = useState(false);

  // Toggle the pressed state on button click
  const handleClick = () => {
    setIsPressed(!isPressed);
    setShowDropdown(!showDropdown);
  };
  

  // handling sign out
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate('/signin')
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className='h-auto w-full bg-[#ecf1f4] lg:px-40 md:px-20 sm:px-10 px-4 py-4 flex items-center justify-between relative'>
      <Link to='/'>
        <h1 className='text-[#373354] font-bold text-2xl'>
          Opportuni<span className='text-[#ffa500] text-3xl'>U</span>
        </h1>
      </Link>

      {/* Desktop Nav */}
      <ul className='hidden md:flex sm:gap-x-8 gap-x-8 text-sm items-center text-[#545859]'>
        <li className='hover:cursor-pointer hover:text-black duration-200'><Link to='/'>Home</Link></li>
        <li className='hover:cursor-pointer hover:text-black duration-200'><Link to='/joblistings'>Apply Now</Link></li>
        <li className='hover:cursor-pointer hover:text-black duration-200'>About Us</li>
        {session ? (
          <li className="relative">
            <button
              onClick={handleClick}
              className='text-[#373354] rounded-[4px] hover:underline duration-200 flex items-center justify-center gap-x-2 nav-dropdown'>
              {session?.user?.user_metadata?.fullname}
              <span className={`nav-dropdownicon ${isPressed ? 'transform rotate-180' : ''}`}><FiChevronDown /></span>
            </button>

            {/*if showdropdown is true, it shows this div*/}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-50">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
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
          <li onClick={() => setIsOpen(false)} className='hover:text-black cursor-pointer duration-200'><Link to='/'>Home</Link></li>
          <li onClick={() => setIsOpen(false)} className='hover:text-black cursor-pointer duration-200'><Link to='/joblistings'>Apply Now</Link></li>
          <li onClick={() => setIsOpen(false)} className='hover:text-black cursor-pointer duration-200'><Link to='/aboutus'>About Us</Link></li>
          <li>
            <button className='mt-4 text-white bg-[#56bb7c] px-6 py-2 rounded-[4px] hover:bg-[#3E9B61] duration-200 w-full'>
              Log In
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
