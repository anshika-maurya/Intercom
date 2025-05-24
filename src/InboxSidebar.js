import React, { useState } from 'react';

const statusColors = {
  'Open': 'bg-green-100 text-green-800',
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Closed': 'bg-gray-100 text-gray-800',
  'Urgent': 'bg-red-100 text-red-800'
};

const filterOptions = [
  { id: 'all', label: 'All conversations' },
  { id: 'open', label: 'Open' },
  { id: 'pending', label: 'Pending' },
  { id: 'closed', label: 'Closed' },
  { id: 'urgent', label: 'Urgent' }
];

const sortOptions = [
  { id: 'recent', label: 'Most recent' },
  { id: 'waiting', label: 'Waiting longest' },
  { id: 'priority', label: 'Priority' }
];

const dummyChats = [
  {
    id: 1,
    name: 'Luis Easton',
    lastMessage: 'I bought a product from your store in November as a Christmas gift for a relative of mine...',
    time: '2m ago',
    unread: true,
    status: 'Open',
    priority: 'high',
    category: 'Refund Request'
  },
  {
    id: 2,
    name: 'Neil Nike',
    lastMessage: 'Hi there, I have a question...',
    time: '5m ago',
    unread: true,
    status: 'Urgent',
    priority: 'high',
    category: 'Product Issue'
  },
  {
    id: 3,
    name: 'Lead from New York',
    lastMessage: 'Good morning, let me...',
    time: '45m ago',
    unread: false,
    status: 'Pending',
    priority: 'medium',
    category: 'Sales'
  },
  {
    id: 4,
    name: 'Booking API problems',
    lastMessage: 'Bug report',
    time: '45m ago',
    unread: false,
    status: 'Open',
    priority: 'low',
    category: 'Technical'
  },
  {
    id: 5,
    name: 'Michelle - Embroidery items',
    lastMessage: "Hey there, I've had an...",
    time: '45m ago',
    unread: false,
    status: 'Closed',
    priority: 'low',
    category: 'Product Question'
  }
];

export default function InboxSidebar({ selectedChat, onSelectChat }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('waiting');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterClick = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
    setIsSortMenuOpen(false);
  };

  const handleSortClick = () => {
    setIsSortMenuOpen(!isSortMenuOpen);
    setIsFilterMenuOpen(false);
  };

  const filteredChats = dummyChats
    .filter(chat => {
      if (statusFilter === 'all') return true;
      return chat.status.toLowerCase() === statusFilter;
    })
    .filter(chat => {
      if (!searchQuery) return true;
      return (
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-gray-900 pl-8 md:pl-0">Your inbox</h2>
          <div className="relative">
            <button
              onClick={handleFilterClick}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-1 border rounded-md"
            >
              <span>{filterOptions.find(opt => opt.id === statusFilter)?.label}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-1 z-10">
                {filterOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setStatusFilter(option.id);
                      setIsFilterMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      statusFilter === option.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <button
              onClick={handleSortClick}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-1 border rounded-md"
            >
              <span>{sortOptions.find(opt => opt.id === sortBy)?.label}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isSortMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-1 z-10">
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortBy(option.id);
                      setIsSortMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortBy === option.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="text-sm text-indigo-600 hover:text-indigo-700">
            New chat
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full px-4 py-2 pl-10 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500">No conversations found</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`p-3 sm:p-4 border-b cursor-pointer transition-colors duration-150 hover:bg-gray-50 ${
                selectedChat?.id === chat.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 sm:gap-2">
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <h3 className="font-medium text-gray-900 text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">{chat.name}</h3>
                      {chat.unread && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          New
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">{chat.time}</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-1.5 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[chat.status]}`}>
                      {chat.status}
                    </span>
                    <span className="text-xs text-gray-500">{chat.category}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 truncate mt-1.5">{chat.lastMessage}</p>
                </div>                <div className="flex items-center gap-2">
                  <div className="min-w-[2rem] w-10 h-10 bg-indigo-100 rounded-full items-center justify-center text-sm font-medium text-indigo-700 hidden sm:flex">
                    {chat.name.charAt(0)}
                  </div>
                  <div className="flex sm:hidden min-w-[2rem] w-8 h-8 bg-indigo-100 rounded-full items-center justify-center text-xs font-medium text-indigo-700">
                    {chat.name.charAt(0)}
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 block sm:hidden">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
