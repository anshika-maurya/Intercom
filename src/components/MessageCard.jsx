import React, { useState, useRef } from 'react';

const MessageCard = ({ message, onAskCopilot }) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Position popup
      if (popupRef.current) {
        popupRef.current.style.top = `${window.scrollY + rect.top - 40}px`;
        popupRef.current.style.left = `${window.scrollX + rect.left}px`;
      }

      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  const handleAskCopilot = () => {
    onAskCopilot(message);
    setShowPopup(false);
    window.getSelection().removeAllRanges(); // clear selection
  };

  return (
    <div className="relative bg-white p-4 rounded shadow border max-w-xl" onMouseUp={handleTextSelection}>
      <p className="text-gray-800 leading-relaxed">
        {message}
      </p>

      {showPopup && (
        <div
          ref={popupRef}
          className="absolute bg-white border shadow px-3 py-1 rounded text-sm font-medium cursor-pointer z-50 flex items-center gap-2"
          onClick={handleAskCopilot}
        >
          🧠 Ask Fin Copilot
        </div>
      )}
    </div>
  );
};

export default MessageCard;
