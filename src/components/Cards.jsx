import React from 'react';
import { FaArrowRight } from "react-icons/fa6";

const Cards = () => {
  return (
    <div>
      <div className='w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 py-24 flex flex-col bg-[#ecf1f4] text-[#373354]'>
        <h1 className='font-semibold text-xl sm:text-2xl lg:text-3xl mb-8'>
          Latest <span className='text-[#56bb7c]'>Job/Program</span> Listings
        </h1>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-5'>
          {[...Array(6)].map((_, index) => (
            <div key={index} className='bg-white hover:bg-[#373354] hover:text-white shadow-lg rounded-lg px-4 sm:px-5 py-4 sm:py-5 duration-200 text-sm sm:text-base'>
              <p className='text-[#909596] font-medium truncate text-xs sm:text-sm'>Pasir Gudang, Johor</p>
              <h1 className='font-medium truncate text-sm sm:text-base'>Kiosk Barista</h1>
              <div className='flex items-center justify-between'>
                <p className='text-[#909596] mt-2 text-xs'>2 days ago</p>
                <div className='bg-[#fff8f4] w-[70px] h-[24px] rounded-sm text-[10px] sm:text-xs flex justify-center items-center text-[#FA5C00]'>Part-Time</div>
              </div>
              <p className='mt-3 text-[#909596] h-[60px] sm:h-[70px] text-[11px] sm:text-sm overflow-hidden card-desc'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At sunt pariatur optio quisquam, repudiandae magnam molestias non ad quaerat...
              </p>
              <button className='mt-3 bg-[#E7F5ED] hover:bg-[#56bb7c] hover:text-white w-[80px] h-[28px] sm:w-[85px] sm:h-[30px] duration-200 rounded-sm text-[11px] sm:text-xs flex justify-center items-center text-[#2D7147] font-medium'>Apply Now</button>
            </div>
          ))}
        </div>
        <div className='flex w-full h-auto items-center justify-center'>
          <a href="/joblistings" className='h-10 sm:h-12 bg-transparent rounded-md px-4  hover:bg-[#56bb7c] hover:text-white text-[#56bb7c] border-[#56bb7c] border-2 duration-200 flex items-center justify-center gap-x-2 mt-10 font-medium'>Browse more<span className='text-lg'><FaArrowRight /></span></a>
        </div>
      </div>
    </div>
  );
};

export default Cards;
