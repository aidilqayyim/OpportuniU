import React from 'react'
import { Link } from 'react-router-dom'
import model from '../assets/bgsignin.jpg';

const SignIn = () => {
  return (
    <div>
      <div className="relative min-h-screen bg-center bg-cover flex justify-center items-center" style={{ backgroundImage: `url(${model})` }}>
        <div className="absolute inset-0 bg-[#ecf1f4]/70 "></div>

        <div>
        <h1 className='relative z-10  text-[#373354] font-bold text-3xl text-center mb-5'>
          Opportuni<span className='text-[#ffa500] text-4xl'>U</span>
        </h1>
        <div className="overflow-hidden rounded-lg relative z-10 sm:w-[400px] w-[350px] bg-white shadow-lg">
            
          <div className="p-6">

            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold">Sign Up</h2>
            </div>
            
            <form className="space-y-4">

                <div>
                    <input 
                     type="Name" 
                    placeholder="Full Name" 
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-sm shadow-sm focus:border-[#3E9B61] focus:outline-none focus:ring-1 focus:ring-[#3E9B61] duration-200"
                    />
                </div>
                <div>
                    <input 
                    type="email" 
                    placeholder="Email" 
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-sm shadow-sm focus:border-[#3E9B61] focus:outline-none focus:ring-1 focus:ring-[#3E9B61] duration-200"
                    />
                </div>
                <div>
                    <input 
                     type="tel" 
                    placeholder="Phone Number" 
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-sm shadow-sm focus:border-[#3E9B61] focus:outline-none focus:ring-1 focus:ring-[#3E9B61] duration-200"
                    />
                </div>
                <div>
                    <input 
                     type="password" 
                    placeholder="Password" 
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-sm shadow-sm focus:border-[#3E9B61] focus:outline-none focus:ring-1 focus:ring-[#3E9B61] duration-200"
                    />
                </div>
                <div>
                    <input 
                     type="password" 
                     placeholder="Confirm Password" 
                     className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-sm shadow-sm focus:border-[#3E9B61] focus:outline-none focus:ring-1 focus:ring-[#3E9B61] duration-200"
                    />
                </div>
                <div className='flex items-center mt-2'>
                    <input
                     type='checkbox'
                     id='remember'
                     className='mr-2'
                     />
                     <label htmlFor="remember" className="text-sm text-gray-700">Remember Me</label>
                </div>

              
                <div className="pt-2">
                    <button 
                    type="submit" 
                    className="w-full rounded-md bg-[#56bb7c] py-3 text-sm font-medium text-white hover:bg-[#3E9B61] duration-200"
                    >
                    Sign Up
                    </button>
                </div>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <button className="font-medium text-purple-600 hover:text-purple-500"><Link to="/signup">Sign In</Link></button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn