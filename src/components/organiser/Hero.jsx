import React, { useState } from 'react';
import model from '../../assets/model.png';
import model2 from '../../assets/model2.jpg';
import { IoSearchSharp, IoArrowForwardSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  return (
    <div>
      {/* Desktop View */}
      <div className='hidden md:block'>
        <div className='bg-[#ecf1f4] flex items-center justify-between w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 whitespace-nowrap py-10'>
          <div className='w-[50%] bg-transparent'>
            <h1 className='font-semibold lg:text-5xl md:text-4xl text-3xl text-[#373354]'>Create opportunities</h1>
            <h1 className='font-semibold lg:text-5xl md:text-4xl text-3xl text-[#373354] mt-2'>for every students</h1>
            <h1 className='font-semibold lg:text-5xl md:text-4xl text-3xl text-[#373354] mt-2'>in UPM!</h1>
            <div className='w-[50%] h-14 mt-8 rounded-md px-2 py-[4px]'>
              <button
                onClick={() => navigate('/organiser/mylistings')}
                className='w-full h-full bg-transparent border-[#56bb7c] border-2 text-[#56bb7c] hover:text-white font-semibold rounded-md hover:bg-[#3E9B61] duration-200 text-sm flex items-center justify-center gap-2 group'
              >
                Create Opportunities
                <IoArrowForwardSharp className="text-lg group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
          <div className="flex items-end justify-end lg:pr-10 sm:pr-1 pr-0 -mb-16">
            <img src={model} alt="" className="w-full max-w-[600px] min-w-[400px] h-auto object-contain" />
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="relative h-[500px] w-full bg-blue-600 bg-cover bg-center block md:hidden"
           style={{ backgroundImage: `url(${model2})` }}>
        <div className="relative z-10 h-full w-full bg-[#ecf1f4]/80 flex items-center flex-col justify-center px-10 text-center">
          <h1 className='font-semibold text-4xl text-[#373354]'>Find activities & part-time jobs near you.</h1>
          <p className='font-normal text-2xl text-[#373354] mt-4'>Opportunity awaits you!</p>
          <div className='w-[80%] h-14 mt-8 rounded-md px-2 py-[4px]'>
            <button
              onClick={() => navigate('/organiser/mylistings')}
              className='w-full h-full bg-transparent border-[#56bb7c] border-2 text-white hover:text-white font-semibold rounded-md hover:bg-[#3E9B61] duration-200 text-sm flex items-center justify-center gap-2 group'
            >
              Create Opportunities
              <IoArrowForwardSharp className="text-lg group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;