import React from 'react'
import { FcGoogle } from "react-icons/fc"
import { Link } from 'react-router-dom'
import model from '../assets/model2.jpg';

const SignIn = () => {
  return (
    <div>
      <div className="relative min-h-screen bg-center bg-cover flex justify-center items-center" style={{ backgroundImage: `url(${model})` }}>
        <div className="absolute inset-0 bg-[#ecf1f4]/70 backdrop-blur-[2px]"></div>

        <div className="overflow-hidden rounded-lg relative z-10 sm:w-[400px] w-[350px] bg-white shadow-lg">
          <div className="p-6">

            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold">Log in with</h2>
              
              <div className="mt-4 flex justify-center space-x-4">
                <button className="flex h-10 w-[80%] px-4 items-center justify-center rounded-md border border-gray-300 bg-white">
                  <FcGoogle size={20}/>
                  <span className="text-sm font-medium ml-2">Google</span>
                </button>
              </div>
              
              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">Or</span>
                </div>
              </div>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <button className="text-xs font-medium text-purple-600 hover:text-purple-500">Forgot Password?</button>
                </div>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full rounded-md bg-[#56bb7c] py-3 text-sm font-medium text-white hover:bg-[#3E9B61] duration-200"
                >
                  LOG IN
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <button className="font-medium text-purple-600 hover:text-purple-500"><Link to="/signup">Sign Up</Link></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn