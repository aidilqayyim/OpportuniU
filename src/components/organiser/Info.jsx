import React from 'react'
import { PiStudentFill } from "react-icons/pi";
import { FaUserTie } from "react-icons/fa6";

const Info = () => {
  return (
    <div>
        <div className='flex items-center justify-center w-full h-auto lg:px-40 md:px-20 sm:px-10 px-4 py-16  flex-col text-center relative z-11 bg-white'>
            <h1 className='font-semibold lg:text-3xl sm:text-2xl text-xl text-[#373354]'>Tailored For You</h1>
            <p className='font-normal text-lg text-[#373354] mt-1'>Create opportunities as both a student or a staff</p>
            <div className='mt-14 flex md:gap-x-24 sm:gap-x-12 gap-x-3'>
                <div className='flex justify-center items-center flex-col md:w-[280px] sm:w-[250px] w-[150px] h-auto text-center'>
                    <div className='bg-[#fff8f4] w-[80px] h-[80px] rounded-3xl flex justify-center items-center text-[30px] text-[#FA5C00] transform rotate-45 hover:bg-[#fa5c00] hover:text-white duration-200'>
                        <PiStudentFill className='transform -rotate-45' />
                    </div>
                    <h1 className='mt-8 text-[#545859] font-medium md:text-xl text-lg'>Student</h1>
                    <p className='font-normal text-[#545859] mt-3 md:text-base text-sm'>Students can create their own programs to find participants for their college programs or extracurricular.</p>
                </div>
                <div className='flex justify-center items-center flex-col md:w-[280px] sm:w-[250px] w-[150px] h-auto text-center'>
                    <div className='bg-[#f4f3fb] w-[80px] h-[80px] rounded-3xl flex justify-center items-center text-[30px] text-[#4E3EBA] transform rotate-45 hover:bg-[#4e3eba] hover:text-white duration-200'>
                        <FaUserTie className='transform -rotate-45' />
                    </div>
                    <h1 className='mt-8 text-[#545859] font-medium md:text-xl text-lg'>Staff</h1>
                    <p className='font-normal text-[#545859] mt-3 md:text-base text-sm'>Staff can post their programs looking for participants or post job postings to search for part-timer.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Info