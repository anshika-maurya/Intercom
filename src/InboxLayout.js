import React, { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoMdClose } from 'react-icons/io';

export default function InboxLayout({ sidebar, mainContent, rightPanel }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white">      {/* Mobile Hamburger Menu */}      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-3 left-2 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {isSidebarOpen ? (
            <IoMdClose className="w-4 h-4 text-white" />
          ) : (
            <RxHamburgerMenu className="w-4 h-4 text-white" />
          )}
          <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </button>

      {/* Left Sidebar - Inbox */}
      <div className={`fixed md:static inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } w-[80vw] md:w-80 flex-shrink-0 border-r border-gray-200`}>
        {sidebar}
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Center - Chat Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${rightPanel ? 'mr-0 lg:mr-96' : ''}`}>
        {mainContent}
      </div>

      {/* Right Side - Copilot Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[400px] lg:w-96 bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          rightPanel ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {rightPanel}
      </div>
    </div>
  );
}
