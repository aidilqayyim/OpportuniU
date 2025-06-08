import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowForwardSharp } from "react-icons/io5";
import { UserAuth } from '../../context/AuthContext';

const Footer = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  // handling sign out
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate('/')
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className='flex items-center justify-center w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 py-16 bg-[#ecf1f4]'>
      <div className='w-full max-w-7xl flex flex-col md:flex-row md:justify-between md:items-start text-white gap-8'>
        <div className='flex flex-col items-start mt-[-10px]'>
          <h1 className='text-[#373354] font-bold text-2xl'>
            Opportuni<span className='text-[#ffa500] text-3xl'>U</span>
          </h1>
          {session ? (
            <button onClick={handleSignOut} className='mt-4'>
              <Link to='/signin' className={`text-white bg-[#FF5B5B] px-8 py-2 rounded-[4px] hover:bg-[#DB0000] duration-200`}>
                Sign Out
              </Link>
            </button>
          ) : (
            <Link to='/signin' className='text-white bg-[#56bb7c] px-8 py-2 rounded-[4px] hover:bg-[#3E9B61] duration-200 mt-4'>
              Log In
            </Link>
          )}
        </div>

        <div className='flex flex-col'>
          <h1 className='font-semibold text-[#373354] whitespace-nowrap'>Quick Links</h1>
          <div className='flex lg:flex-row text-[#373354] mt-2 lg:space-x-10 flex-col whitespace-nowrap lg:space-y-0 space-y-4'>
            <p className='hover:cursor-pointer hover:text-black duration-200'><Link to='/organiser/'>Home</Link></p>
            <p className='hover:cursor-pointer hover:text-black duration-200'><Link to='/organiser/mylistings'>Create Opportunities</Link></p>
          </div>
        </div>

        <div className='w-full md:w-[50%] '>
        </div>
      </div>
    </div>
  );
};

export default Footer;
