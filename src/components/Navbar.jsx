import React from 'react';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Travel Admin Panel</h1>
          <p className="text-sm text-gray-600">Manage your travel itineraries and bookings</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5z" />
              </svg>
            </button>
          </div>
          
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <span className="ml-2 text-sm text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;