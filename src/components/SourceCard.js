import React, { useState } from 'react';
import { TfiNewWindow } from "react-icons/tfi";

const SourceCard = ({ onAddToComposer }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="mt-2">
      <div className="bg-white border shadow-sm rounded-lg">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Getting a refund</h4>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
              Public article
            </div>
            <span className="text-xs text-gray-500">Amy Adams • 1d ago</span>
          </div>
          
          {expanded ? (
            <div className="mt-3 bg-white p-4 rounded-lg border shadow-lg absolute top-0 left-0 right-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                    Public article
                  </div>
                  <span className="text-xs text-gray-500">Amy Adams • 1d ago</span>
                </div>
                <button onClick={() => setExpanded(false)} className="text-gray-400 hover:text-gray-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="mt-3">
                <h4 className="font-medium">Getting a refund</h4>
                <p className="text-sm text-gray-600 mt-2">
                  We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund. This guide outlines the simple steps to help you navigate the refund process and ensure a smooth resolution to your concern.
                </p>
              </div>
              
              <div className="border-t mt-4 pt-3">
                <button
                  onClick={onAddToComposer}
                  className="flex items-center justify-center gap-2 text-gray-800 font-medium text-sm bg-white border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 w-full"
                >
                  <TfiNewWindow />
                  Add to composer
                </button>
              </div>
            </div>
          ) : (
            <div onClick={() => setExpanded(true)} className="mt-2 cursor-pointer">
              <p className="text-sm text-gray-600 line-clamp-2">
                We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund. This guide outlines the simple steps to help you navigate the refund process and ensure a smooth resolution to your concern.
              </p>
            </div>
          )}
        </div>
        
        <div className="border-t p-2 flex justify-center">
          <button
            onClick={onAddToComposer}
            className="flex items-center justify-center gap-2 text-gray-800 text-sm w-full py-1"
          >
            <TfiNewWindow />
            Add to composer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SourceCard; 