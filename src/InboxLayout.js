import React from 'react';

export default function InboxLayout({ sidebar, mainContent, rightPanel }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Left Sidebar - Inbox */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200">
        {sidebar}
      </div>

      {/* Center - Chat Area */}
      <div className="flex-1 flex flex-col">
        {mainContent}
      </div>

      {/* Right Side - Copilot Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          rightPanel ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {rightPanel}
      </div>
    </div>
  );
}
