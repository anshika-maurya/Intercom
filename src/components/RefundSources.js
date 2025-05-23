import React, { useState } from 'react';
import { TfiNewWindow } from "react-icons/tfi";

const RefundSource = ({ title, sourceType, author, time, content, onClick }) => {
  return (
    <div 
      className="mt-2 py-1.5 px-1 hover:bg-gray-100 rounded cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="ml-3">
        <div className="flex items-center gap-2 mt-1">
          <div className={`${sourceType === 'Public article' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'} text-xs px-2 py-0.5 rounded`}>
            {sourceType}
          </div>
          <span className="text-xs text-gray-500">{author} • {time}</span>
        </div>
      </div>
    </div>
  );
};

const RefundSourceDetail = ({ title, sourceType, author, time, content, onClose, onAddToComposer }) => {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-30" onClick={onClose}>
      <div 
        className="bg-white border shadow-lg rounded-lg m-4 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`${sourceType === 'Public article' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'} text-xs px-2 py-0.5 rounded`}>
                {sourceType}
              </div>
              <span className="text-xs text-gray-500">{author} • {time}</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="mt-3">
            <h4 className="font-medium">{title}</h4>
            <div className="mt-2">
              <p className="text-sm text-gray-600">{content}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t p-3 flex justify-center">
          <button
            onClick={() => onAddToComposer(content)}
            className="flex items-center justify-center gap-2 text-gray-800 font-medium text-sm bg-white border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 w-full"
          >
            <TfiNewWindow />
            Add to composer
          </button>
        </div>
      </div>
    </div>
  );
};

const RefundSources = ({ onAddToComposer }) => {
  const [selectedSource, setSelectedSource] = useState(null);
  
  const refundSources = [
    {
      id: 1,
      title: 'Getting a refund',
      sourceType: 'Public article',
      author: 'Amy Adams',
      time: '1d ago',
      content: "We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund. This guide outlines the simple steps to help you navigate the refund process and ensure a smooth resolution to your concern."
    },
    {
      id: 2,
      title: 'Refund for an order placed by mistake',
      sourceType: 'Public article',
      author: 'Jordan Lee',
      time: '2d ago',
      content: `If you placed an order by mistake, you can request a refund by contacting our customer service team within 24 hours of placing the order. We'll do our best to cancel the order before it's processed.`
    },
    {
      id: 3,
      title: 'Refund for an unwanted gift',
      sourceType: 'Conversation',
      author: 'Theresa Eds',
      time: '3d ago',
      content: "Unfortunately, we are only able to process refunds for orders that were placed within the last 60 days. Your order was placed well past the cut off date."
    }
  ];

  const handleSourceClick = (source) => {
    setSelectedSource(source);
  };

  const handleCloseDetail = () => {
    setSelectedSource(null);
  };

  return (
    <div className="mt-4">
      <div className="text-sm text-gray-500 mb-2">
        15 relevant sources found
      </div>
      
      <div>
        {refundSources.map((source) => (
          <RefundSource
            key={source.id}
            title={source.title}
            sourceType={source.sourceType}
            author={source.author}
            time={source.time}
            content={source.content}
            onClick={() => handleSourceClick(source)}
          />
        ))}
      </div>
      
      <div className="mt-2 text-center">
        <button className="text-xs text-blue-600 font-medium flex items-center justify-center">
          See all
          <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {selectedSource && (
        <RefundSourceDetail
          title={selectedSource.title}
          sourceType={selectedSource.sourceType}
          author={selectedSource.author}
          time={selectedSource.time}
          content={selectedSource.content}
          onClose={handleCloseDetail}
          onAddToComposer={onAddToComposer}
        />
      )}
    </div>
  );
};

export default RefundSources;