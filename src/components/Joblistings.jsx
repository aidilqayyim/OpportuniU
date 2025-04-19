import React from 'react'
import { Link } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

const Joblistings = () => {
  return (
    <div>
      {/* Search Bar */}
      <div className='bg-[#ecf1f4] w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 pb-8 pt-4 flex justify-between'>
        <form className='w-full flex flex-col md:flex-row items-start md:items-center gap-4'>
          <div className='flex flex-col w-full md:w-[40%]'>
            <label htmlFor="keywords" className='text-[#373354] font-medium text-lg'>Keywords</label>
            <input
              type="text"
              id="keywords"
              placeholder="Enter keywords"
              className='my-1 h-11 px-4 rounded-md border border-gray-300 bg-white'
            />
          </div>
          <div className='flex flex-col w-full md:w-[30%]'>
            <label htmlFor="type" className='text-[#373354] font-medium text-lg'>Type</label>
            <div className="relative">
              <select
                id="type"
                className="my-1 h-11 w-full px-5 pr-10 rounded-md border border-gray-300 bg-white appearance-none"
              >
                <option value="both">Both</option>
                <option value="program">Program</option>
                <option value="job">Job</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <div className='flex w-full md:w-[30%] justify-start md:pl-10'>
            <button className='w-full md:w-[40%] text-white bg-[#56bb7c] px-6 py-2 rounded-[4px] hover:bg-[#3E9B61] duration-200'>
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Listing Section */}
      <div className='w-full h-auto bg-white lg:px-40 md:px-20 sm:px-10 px-4 py-8 flex flex-col items-center'>
        <div className='w-full h-auto'>
          <h1 className='font-semibold text-[#373354] text-2xl mb-3'>Jobs/Program Listing</h1>
        </div>

        <div className='flex flex-col lg:flex-row w-full h-auto gap-6'>
          {/* Listing */}
          <div className='flex flex-col flex-1 gap-y-4'>
            <div className="w-full h-[1px] bg-gray-300 self-stretch mb-2"></div>
            {[...Array(6)].map((_, index) => (
              <Link to="/jobdesc" key={index} className='bg-transparent hover:bg-[#373354] hover:text-white text-[#373354] rounded-lg px-4 py-4 duration-200 text-sm sm:text-base w-full cursor-pointer border-[3px] hover:border-[#373354]'>
                <div className='flex flex-col sm:flex-row justify-between gap-y-2'>
                  <p className='text-[#909596] font-medium truncate text-base sm:text-lg'>Pasir Gudang, Johor</p>
                  <div className='flex gap-x-2 flex-wrap sm:flex-nowrap mb-2'>
                    <div className='bg-[#fff8f4] h-[30px] rounded-sm text-sm flex items-center text-[#FA5C00] px-2'>RM 1,500 a month</div>
                    <div className='bg-[#fff8f4] h-[30px] rounded-sm text-sm flex items-center text-[#FA5C00] px-2'>Part-Time</div>
                  </div>
                </div>
                <h1 className=' font-semibold truncate text-xl sm:text-2xl'>Barista (FSKTM)</h1>
                <p className='text-[#909596] mt-2 sm:text-base text-xs'>2 days ago</p>
                <p className='mt-3 h-[60px] sm:h-[70px] text-[11px] sm:text-sm overflow-hidden card-desc'>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit, ratione? Labore repellat, dicta pariatur, aperiam dolor, sequi minus facere ut quidem quas repellendus quod iusto laborum doloremque quis omnis perspiciatis!
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga adipisci at ut suscipit impedit. Est illum, nostrum saepe dolorum pariatur neque quas, iusto eos fuga nam quibusdam quis ut magni.
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
                <input type="radio" name="sortby" value="relevance" className="form-radio text-blue-600" />
                <span>Relevance</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input type="radio" name="sortby" value="newest" className="form-radio text-blue-600" />
                <span>Newest</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input type="radio" name="sortby" value="oldest" className="form-radio text-blue-600" />
                <span>Oldest</span>
              </label>
            </form>
          </div>
        </div>

        {/* Pagination */}
        <div className='flex flex-col sm:flex-row gap-y-4 sm:gap-x-5 w-full items-center justify-center mt-10'>
          <a href="/joblistings" className='h-10 sm:h-12 bg-transparent rounded-md px-4 hover:bg-[#56bb7c] hover:text-white text-[#56bb7c] border-[#56bb7c] border-2 duration-200 flex items-center justify-center font-medium'>
            <span className='text-lg flex items-center gap-x-2'><FaArrowLeft />Previous</span>
          </a>
          <a href="/joblistings" className='h-10 sm:h-12 bg-transparent rounded-md px-4 hover:bg-[#56bb7c] hover:text-white text-[#56bb7c] border-[#56bb7c] border-2 duration-200 flex items-center justify-center font-medium'>
            <span className='text-lg flex items-center gap-x-2'>Next<FaArrowRight /></span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Joblistings
