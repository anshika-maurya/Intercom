import React, { useState } from 'react';

const RefundDetailView = ({ onAddToComposer }) => {
  const [expandedParagraphs, setExpandedParagraphs] = useState({});
  
  const toggleParagraph = (id) => {
    setExpandedParagraphs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  return (
    <div className="relative bg-gradient-to-br from-purple-100/90 to-purple-50/80 rounded-lg p-5 my-3">
      <div className="mb-4">
        <h3 className="font-medium text-gray-800 mb-1">We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund.</h3>
        
        <p className="text-sm text-gray-700 mt-3 relative pr-6">
          To assist you with your refund request, could you please provide your order ID and proof of purchase.
          <button 
            onClick={() => toggleParagraph('details')}
            className="absolute right-0 top-0 flex items-center justify-center w-5 h-5 bg-indigo-600 rounded-full text-white text-xs font-bold"
          >
            1
          </button>
        </p>
        
        {expandedParagraphs['details'] && (
          <div className="mt-3 pl-2 border-l-2 border-indigo-200">
            <p className="text-sm font-medium text-gray-800">Please note:</p>
            <p className="text-sm text-gray-700 mt-1">
              We can only refund orders placed within the last 60 days, and your item must meet our requirements for condition to be returned. Please check when you placed your order before proceeding.
            </p>
          </div>
        )}

        <p className="text-sm text-gray-700 mt-4 relative pr-6">
          Once I've checked these details, if everything looks OK, I will send a returns QR code which you can use to post the item back to us. Your refund will be automatically issued once you put it in the post.
          <button 
            onClick={() => toggleParagraph('qrcode')}
            className="absolute right-0 top-0 flex items-center justify-center w-5 h-5 bg-indigo-600 rounded-full text-white text-xs font-bold"
          >
            2
          </button>
        </p>
        
        {expandedParagraphs['qrcode'] && (
          <div className="mt-3 pl-2 border-l-2 border-indigo-200">
            <p className="text-sm text-gray-700">
              The QR code will be sent to your registered email address. Simply scan the code at any drop-off point and your package will be automatically tracked in our system.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center border-t border-purple-200 pt-3">
        <button 
          onClick={onAddToComposer}
          className="flex items-center justify-center gap-2 text-gray-800 font-medium text-sm bg-white py-2 px-4 rounded border border-gray-300 hover:bg-gray-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add to composer
        </button>
      </div>

      <div className="text-sm text-gray-500 mt-4">
        15 relevant sources found
      </div>
    </div>
  );
};

export default RefundDetailView; 