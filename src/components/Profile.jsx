import React from 'react';
import { Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import model3 from '../assets/model3.jpg';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaPen } from 'react-icons/fa';

const Profile = () => {
  const { session } = UserAuth();
  const user = session?.user;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative">
    {/* Background image - same as AboutUs page */}
    <div 
      className='absolute inset-0 bg-cover bg-center z-[-1] opacity-60'
      style={{ backgroundImage: `url(${model3})` }}
    />
        <div className="max-w-4xl mx-auto">   
            <div 
                className="mb-6">
            </div>

            {/* Profile Header */}
            <div className="bg-white shadow rounded-lg mb-6 p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="h-32 w-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-6xl mb-4 md:mb-0 md:mr-6">
                <FaUser />
                </div>
                <div className="text-center md:text-left flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                    {user?.user_metadata?.fullname || "Complete your profile"}
                    </h1>
                    <button 
                    className="mt-2 md:mt-0 flex items-center justify-center gap-1 text-white bg-[#56bb7c] px-4 py-2 rounded hover:bg-[#3E9B61]"
                    >
                    <FaPen className="text-sm" /> Edit Profile
                    </button>
                </div>
                
                <p className="text-gray-600 mt-1">Network Computer</p>
                <div className="flex items-center justify-center md:justify-start mt-2 text-gray-600">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>UPM</span>
                </div>
                <div className="flex items-center justify-center md:justify-start mt-2 text-gray-600">
                    <FaEnvelope className="mr-1" />
                    <span>{user?.email || "Email not available"}</span>
                </div>

                </div>
            </div>
            </div>

        {/* Description Section */}
        <div className='bg-white shadow rounded-lg mb-6 p-6'>
            <div className='flex justify-between items-center mb-5'>
                <h2 className='text-xl font-bold text-gray-800'>Description</h2>
                    <button className='text-blue-600 hover:text-blue-800 '>
                        Edit Description
                    </button>
            </div>
        <div className='text-gray-700'>
            <p className='mb-4'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim distinctio laudantium eveniet ullam odio nam! Nihil iste reprehenderit tenetur distinctio, dignissimos velit nisi corporis maxime perspiciatis numquam, officia, incidunt natus!
            </p>
        </div>

        </div>
        {/* Job Applications Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Job and Program Applications</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 ">NAME</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 ">JOB/PROGRAM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 ">DATE APPLIED</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 ">STATUS</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">----</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">----</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">April 15, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Under Review
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">-----</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">----</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">April 10, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Accepted
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Link 
              to="/joblistings" 
              className="inline-block text-white bg-[#56bb7c] px-4 py-2 rounded hover:bg-[#3E9B61]"
            >
              Browse More Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;