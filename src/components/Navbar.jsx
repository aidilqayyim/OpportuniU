import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMenu, IoClose } from "react-icons/io5";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        <li className='hover:cursor-pointer hover:text-black duration-200'>Apply Now</li>
        <li className='hover:cursor-pointer hover:text-black duration-200'>About Us</li>
        <li>
          <button className='text-white bg-[#56bb7c] px-8 py-2 rounded-[4px] hover:bg-[#3E9B61] duration-200'>
            Log In
          </button>
        </li>
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
          <li onClick={() => setIsOpen(false)} className='hover:text-black cursor-pointer duration-200'>Apply Now</li>
          <li onClick={() => setIsOpen(false)} className='hover:text-black cursor-pointer duration-200'>About Us</li>
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
