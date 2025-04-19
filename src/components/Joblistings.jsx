import React from 'react'
import { Link } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

const Joblistings = () => {
  return (
<div>
    <div className='bg-[#ecf1f4] w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 pb-8 pt-4 flex items-center justify-between'>
        <form className='w-full flex items-center gap-4'>
            <div className='flex flex-col w-[40%]'>
                <label htmlFor="keywords" className='text-[#373354] font-medium text-lg'>Keywords</label>
                <input
                    type="text"
                    id="keywords"
                    placeholder="Enter keywords"
                    className='my-1 h-11 px-4 rounded-md border border-gray-300 bg-white'
                />
            </div>
            <div className='flex flex-col w-[30%]'>
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
            <div className='flex justify-start w-[30%] pl-10'>
                <button className='w-[40%] text-white bg-[#56bb7c] px-6 py-2 rounded-[4px] hover:bg-[#3E9B61] duration-200'>
                    Search
                </button>
            </div>
        </form>
    </div>
    <div className='w-full h-auto bg-white lg:px-40 md:px-20 sm:px-10 px-4 py-8 flex justify-center flex-col items-center'>
        <h1 className='font-semibold text-[#373354] text-2xl hidden'>Showing results of ''</h1>
        <div className='w-full h-auto'>
            <h1 className='font-semibold text-[#373354] text-2xl mb-3'>Jobs/Program Listing</h1>
        </div>
        <div className='flex flex-row w-full h-auto gap-x-0'>
        <div className='flex flex-col flex-1 gap-y-4'>
            <div className="w-full h-[1px] bg-gray-300 self-stretch mb-2"></div>
                {[...Array(6)].map((_, index) => (
                    <div key={index} className='bg-transparent hover:bg-[#373354] hover:text-white text-[#373354] rounded-lg px-4 sm:px-5 py-4 sm:py-5 duration-200 text-sm sm:text-base w-full cursor-pointer border-[3px] hover:border-[#373354]'>
                        <Link to="/jobdesc">
                            <div className='flex justify-between'>
                                <p className='text-[#909596] font-medium truncate text-base sm:text-lg'>Pasir Gudang, Johor</p>
                                <div className='flex gap-x-2 ml-auto'>
                                    <div className='bg-[#fff8f4] w-auto h-[30px] rounded-sm text-[20px] sm:text-base flex justify-center items-center text-[#FA5C00] px-2'>RM 1,500 a month</div>
                                    <div className='bg-[#fff8f4] w-auto h-[30px] rounded-sm text-[20px] sm:text-base flex justify-center items-center text-[#FA5C00] px-2'>Part-Time</div>
                                </div>
                            </div>
                            <h1 className=' font-semibold truncate text-base sm:text-2xl'>Barista (FSKTM)</h1>
                            <p className='text-[#909596] mt-2 text-base'>2 days ago</p>
                            <p className='mt-3 h-[60px] sm:h-[70px] text-[11px] sm:text-sm overflow-hidden card-desc'>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. At sunt pariatur optio quisquam, repudiandae magnam molestias non ad quaerat. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, assumenda ratione ad in dignissimos quasi animi harum velit repellat, accusamus laborum ex voluptate vitae laboriosam id dolor, earum dicta autem.
                            </p>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="w-[1.1px] bg-gray-300 self-stretch mr-10 ml-16"></div>
            <div className='w-[20%]'>
                <p className='text-[#909596]'>SORT BY</p>
                <div className='w-full bg-gray-300 self-stretch h-[1.2px] my-3'></div>
                <form className='flex flex-col gap-y-3 mt- h-auto w-full'>
                    <label class="inline-flex items-center space-x-2">
                        <input type="radio" name="sortby" value="relevance" class="form-checkbox text-blue-600" />
                        <span>Relevance</span>
                    </label>
                    <label class="inline-flex items-center space-x-2">
                        <input type="radio" name="sortby" value="newest" class="form-checkbox text-blue-600" />
                        <span>Newest</span>
                    </label>
                    <label class="inline-flex items-center space-x-2">
                        <input type="radio" name="sortby" value="oldest" class="form-checkbox text-blue-600" />
                        <span>Oldest</span>
                    </label>
                </form>            
            </div>
        </div>
        <div className='flex gap-x-5'>
            <div className='flex w-full h-auto items-center justify-center'>
                <a href="/joblistings" className='h-10 sm:h-12 bg-transparent rounded-md px-4  hover:bg-[#56bb7c] hover:text-white text-[#56bb7c] border-[#56bb7c] border-2 duration-200 flex items-center justify-center mt-10 font-medium'><span className='text-lg flex items-center justify-center gap-x-2 '><FaArrowLeft />Previous</span></a>
            </div>
            <div className='flex w-full h-auto items-center justify-center'>
                <a href="/joblistings" className='h-10 sm:h-12 bg-transparent rounded-md px-4  hover:bg-[#56bb7c] hover:text-white text-[#56bb7c] border-[#56bb7c] border-2 duration-200 flex items-center justify-center gap-x-2 mt-10 font-medium'>Next<span className='text-lg'><FaArrowRight /></span></a>
            </div>
        </div>
    </div>
</div>
  )
}

export default Joblistings