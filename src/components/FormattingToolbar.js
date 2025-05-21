import React, { useState } from 'react';

const FormattingToolbar = ({ position, onClose, onOptionSelect }) => {
  // Main options
  const [showRephrase, setShowRephrase] = useState(false);
  
  const options = [
    { id: 'my_tone', label: 'My tone of voice' },
    { id: 'friendly', label: 'More friendly' },
    { id: 'formal', label: 'More formal' },
    { id: 'grammar', label: 'Fix grammar & spelling' },
    { id: 'translate', label: 'Translate...' },
  ];

  // Formatting buttons that appear in the toolbar
  const formattingButtons = [
    { id: 'bold', label: 'B', className: 'font-bold' },
    { id: 'italic', label: 'i', className: 'italic' },
    { id: 'code', label: '</>', className: '' },
    { id: 'link', label: '🔗', className: '' },
    { id: 'h1', label: 'H1', className: '' },
    { id: 'h2', label: 'H2', className: '' },
  ];

  // Positioning styles for the toolbar
  const style = position ? {
    position: 'fixed',
    top: `${position.y}px`,
    left: `${position.x}px`,
    transform: 'translateX(-50%)',
    zIndex: 10000,
    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
  } : {};

  const handleRephrase = () => {
    setShowRephrase(!showRephrase);
  };

  const handleOptionSelect = (optionId) => {
    onOptionSelect(optionId);
    setShowRephrase(false);
  };

  return (
    <div className="formatting-toolbar" style={style} onClick={(e) => e.stopPropagation()}>
      {!showRephrase ? (
        <div className="bg-white rounded shadow-lg border border-gray-200 flex items-center">
          <button 
            className="px-3 py-1.5 text-sm border-r border-gray-200 hover:bg-gray-50 relative font-medium flex items-center gap-1"
            onClick={handleRephrase}
          >
            Rephrase
            <svg className="w-4 h-4 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Formatting buttons */}
          {formattingButtons.map((button) => (
            <button
              key={button.id}
              className={`px-3 py-1.5 text-sm hover:bg-gray-50 ${button.className}`}
              onClick={() => onOptionSelect(button.id)}
            >
              {button.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[220px]">
          <div>
            <div className="py-2 px-4 text-base font-medium border-b border-gray-200">
              Rephrase
            </div>
            {options.map((option, index) => (
              <button
                key={option.id}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 ${
                  index === 0 ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleOptionSelect(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormattingToolbar; 