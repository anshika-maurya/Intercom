import React, { useState } from 'react';

const FormattingToolbar = ({ position }) => {
  const [showRephrase, setShowRephrase] = useState(false);

  const formattingButtons = [
    { id: 'bold', label: 'B', className: 'font-bold' },
    { id: 'italic', label: 'i', className: 'italic' },
    { id: 'code', label: '</>', className: 'font-mono' },
    { id: 'link', label: '🔗', className: '' },
    { id: 'h1', label: 'H1', className: 'text-lg font-bold' },
    { id: 'h2', label: 'H2', className: 'text-md font-semibold' },
  ];

  const rephraseOptions = [
    { id: 'my_tone', label: 'My tone of voice' },
    { id: 'friendly', label: 'More friendly' },
    { id: 'formal', label: 'More formal' },
    { id: 'grammar', label: 'Fix grammar & spelling' },
    { id: 'translate', label: 'Translate...' },
  ];

  const style = position
    ? {
        position: 'absolute',
        top: `${position.y - 70}px`,
        left: `${position.x}px`,
        transform: 'translateX(-50%)',
        zIndex: 10000,
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
      }
    : {};

  // Map your buttons to execCommand commands
  const commandMap = {
    bold: 'bold',
    italic: 'italic',
    code: 'insertHTML', // for code, we will wrap selection in <code> tag
    link: 'createLink',
    h1: 'formatBlock',
    h2: 'formatBlock',
  };

  const handleFormat = (id) => {
    if (id === 'code') {
      // Wrap selection in <code> tag
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const codeNode = document.createElement('code');
      codeNode.textContent = selection.toString();
      range.deleteContents();
      range.insertNode(codeNode);
    } else if (id === 'link') {
      const url = prompt('Enter the URL');
      if (url) {
        document.execCommand('createLink', false, url);
      }
    } else if (id === 'h1') {
      document.execCommand('formatBlock', false, 'H1');
    } else if (id === 'h2') {
      document.execCommand('formatBlock', false, 'H2');
    } else {
      document.execCommand(commandMap[id], false, null);
    }
  };

  const handleOptionSelect = (optionId) => {
    // Here you can integrate rephrase option selection logic
    // For now, just close the dropdown
    setShowRephrase(false);
  };

  return (
    <div
      className="formatting-toolbar"
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded shadow-lg border border-gray-200 flex items-center space-x-1 px-1 py-1">
        {/* AI Button replacing Rephrase dropdown */}
        <button
          className="bg-black text-white text-sm font-medium w-8 h-8 flex items-center justify-center rounded-sm"
          onClick={() => setShowRephrase(!showRephrase)}
          aria-label="AI Rephrase options"
          type="button"
        >
          AI
        </button>

        {formattingButtons.map((btn) => (
          <button
            key={btn.id}
            className={`px-2 py-1.5 text-sm hover:bg-gray-100 rounded ${btn.className}`}
            onClick={() => handleFormat(btn.id)}
            type="button"
            aria-label={btn.id}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Inline panel with rephrase options */}
      {showRephrase && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mt-1 p-2 min-w-[220px] absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          {rephraseOptions.map((option, index) => (
            <button
              key={option.id}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                index === 0 ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleOptionSelect(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormattingToolbar;
