import React from 'react'
import model3 from '../assets/model3.jpg';

const AboutUs = () => {
  return (
    
    <div className='flex flex-col text-center items-center justify-center px-[300px] py-[150px] w-full'>
        {/*image section*/}
        <div 
            className='absolute inset-0 bg-cover bg-center z-[-1] opacity-60 pb-[800px]'
            style={{ backgroundImage: `url(${model3})` }}
        />  
        
        <h1 className='font-semibold text-[45px] px-[10px] pb-10 text-[#373354] z-20'>
            "Opportunities don’t just happen—you find them. Let’s make the search easier, together."
        </h1>
        <h1 className='text-[20px] text-[#373354] z-20'>
            We created this platform to make student life easier and more rewarding. Our mission is to help students discover committee activities, collect merit points, and find part-time job opportunities—all in one place. Whether you're looking to get involved on campus, build your resume, or earn some extra income, we've got you covered. We're here to support your journey, connect you with the right opportunities, and help you make the most out of your university experience.
        </h1>
    </div>
    
  )
}

export default AboutUs
