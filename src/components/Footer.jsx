import React from 'react'
import { Link } from 'react-router-dom';
import { IoSearchSharp } from "react-icons/io5";

const Footer = () => {
  return (
    <div className='flex items-center justify-center w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 py-16 bg-[#ecf1f4]'>
      <div className='w-full max-w-7xl flex flex-col md:flex-row md:justify-between md:items-start text-white gap-8'>
        <div className='flex flex-col items-start mt-[-10px]'>
          <h1 className='text-[#373354] font-bold text-2xl'>
            Opportuni<span className='text-[#ffa500] text-3xl'>U</span>
          </h1>
          <a href='/signin' className='text-white bg-[#56bb7c] px-6 py-2 rounded-[4px] hover:bg-[#3E9B61] duration-200 mt-3'>
            Log In
          </a>
        </div>

        <div className='flex flex-col'>
          <h1 className='font-semibold text-[#373354] whitespace-nowrap'>Quick Links</h1>
          <div className='flex lg:flex-row text-[#373354] mt-2 lg:space-x-10 flex-col whitespace-nowrap lg:space-y-0 space-y-4'>
            <p className='hover:cursor-pointer hover:text-black duration-200'><Link to='/'>Home</Link></p>
            <p className='hover:cursor-pointer hover:text-black duration-200'><Link to='/joblistings'>Apply Now</Link></p>
            <p className='hover:cursor-pointer hover:text-black duration-200'>About Us</p>
          </div>
        </div>

        <div className='w-full md:w-[50%] '>
          <div className='bg-white w-full md:h-14 sm:h-14 h-24 mt-4 md:mt-0 rounded-md px-3 py-2 shadow-xl'>
            <form className='flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 h-full'>
              <input
                type="text"
                placeholder="Enter job/program title or keywords"
                className='focus:outline-none text-sm h-full sm:h-full w-full bg-[#f5f6fa] rounded-md px-4 text-black'
              />
              <button className='h-10 sm:h-full bg-[#56bb7c] rounded-md px-4 text-white hover:bg-[#3E9B61] duration-200 flex items-center justify-center'>
                <IoSearchSharp />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
