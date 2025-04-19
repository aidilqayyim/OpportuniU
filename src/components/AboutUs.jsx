import React from 'react'
import model3 from '../assets/model3.jpg';

const AboutUs = () => {
  return (
    
    <div className='relative text-center w-full min-h-[100%] sm:min-h-[400px] md:min-h-[600px] lg:min-h-[800px] bg-center bg-cover flex flex-col justify-center items-center gap-y-7 lg:px-72 md:px-32 sm:px-20 px-14 py-20' 
    style={{ backgroundImage: `url(${model3})`}}>

      <div className="absolute inset-0 bg-[#ecf1f4]/55 "></div>
      <h1 className='font-semibold text-[45px] text-[#373354] z-10'>
        "Opportunities don’t just happen—you find them. Let’s make the search easier, together."
      </h1>
      <h1 className='text-[20px] text-black z-10'>
        We created this platform to make student life easier and more rewarding. Our mission is to help students discover committee activities, collect merit points, and find part-time job opportunities—all in one place. Whether you're looking to get involved on campus, build your resume, or earn some extra income, we've got you covered. We're here to support your journey, connect you with the right opportunities, and help you make the most out of your university experience.
      </h1>

    </div>  
  )
}

export default AboutUs
