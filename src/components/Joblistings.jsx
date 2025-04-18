import React from 'react'
import { FiChevronDown } from 'react-icons/fi';

const Joblistings = () => {
  return (
<div>
    <div className='bg-white w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 py-4 flex items-center justify-between mt-4'>
        <form className='w-full flex items-center gap-4'>
            {/* Keywords Input */}
            <div className='flex flex-col w-[40%]'>
                <label htmlFor="keywords">Keywords</label>
                <input
                    type="text"
                    id="keywords"
                    placeholder="Enter keywords"
                    className='my-1 h-11 px-4 rounded-md border border-gray-300 bg-white'
                />
            </div>

            {/* Type Dropdown */}
            <div className='flex flex-col w-[30%]'>
                <label htmlFor="type">Type</label>
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

            {/* Search Button */}
            <div className='flex justify-start w-[30%] pl-10'>
                <button className='w-[40%] text-white bg-[#56bb7c] px-6 py-2 rounded-[4px] hover:bg-[#3E9B61] duration-200'>
                    Search
                </button>
            </div>
        </form>
    </div>
</div>
  )
}

export default Joblistings