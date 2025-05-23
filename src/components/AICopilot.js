import React, { useState, useEffect, useRef } from 'react';


import RefundSources from './RefundSources';
import FormattingToolbar from './FormattingToolbar';
import { FaIntercom } from "react-icons/fa";
import { LuPanelRightClose } from "react-icons/lu";
import { FaTruckPickup } from "react-icons/fa";
import { TfiNewWindow } from "react-icons/tfi";
import { FcMoneyTransfer } from "react-icons/fc";

const NumberedIcon = ({ number, onClick }) => (
  <button 
    onClick={onClick}
    className="inline-flex items-center justify-center w-5 h-5 bg-indigo-600 rounded-full text-white text-xs font-bold ml-1"
  >
    {number}
  </button>
);

const ArticlePopup = ({ title, content, onClose, onAddToComposer }) => {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-30" onClick={onClose}>
      <div 
        className="bg-white border shadow-lg rounded-lg m-4 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                Public article
              </div>
              <span className="text-xs text-gray-500">Amy Adams • 1d ago</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-gray-600 mt-2">
              {content}
            </p>
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



const AICopilot = ({ onClose, setMessageInput }) => {
  
 const [inputPlaceholder, setInputPlaceholder] = useState("Ask a question...");
  const [searchQuery, setSearchQuery] = useState('');
  const [showInitialState, setShowInitialState] = useState(true);
  const [conversation, setConversation] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSourceCard, setShowSourceCard] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [showRefundSources, setShowRefundSources] = useState(false);
  const [showArticlePopup, setShowArticlePopup] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState(null);
  const [showSuggestedText, setShowSuggestedText] = useState(true);
  const contentRef = useRef(null);


  

  // New state to control Suggested text visibility
  
  // Scroll handler to hide "Suggested How do I get a refund?" when scrolling down
    const handleScroll = () => {
    if (!contentRef.current) return;
    const scrollTop = contentRef.current.scrollTop;

    if (scrollTop > 20) {
      setShowSuggestedText(false);
    } else {
      setShowSuggestedText(true);
    }
  };

   useEffect(() => {
    const contentEl = contentRef.current;
    if (contentEl) {
      contentEl.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (contentEl) {
        contentEl.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);


  const articleContents = {
    details: {
      title: "Getting a refund",
      content: "We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund. This guide outlines the simple steps to help you navigate the refund process and ensure a smooth resolution to your concern. Please note: We can only refund orders placed within the last 60 days, and your item must meet our requirements for condition to be returned. Please check when you placed your order before proceeding."
    },
    qrcode: {
      title: "Refund for an unwanted gift",
      content: "Unfortunately, we're only able to process refunds for orders that were placed within the last 60 days. Your order was placed well past the cut off date. Once I've checked these details, if everything looks OK, I will send a returns QR code which you can use to post the item back to us. Your refund will be automatically issued once you put it in the post."
    }
  };
  
  const toggleSection = (sectionId) => {
    setShowArticlePopup(articleContents[sectionId]);
  };
  
  // Handle mouse up event for text selection
  const handleContentMouseUp = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText) {
      // Get selection position
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Calculate toolbar position - position above the text
      const x = rect.left + (rect.width / 2);
      const y = rect.top - 10; // Show toolbar closer to the text
      
      setSelectedText(selectedText);
      setToolbarPosition({ x, y });
      setShowFormattingToolbar(true);
    }
  };

  // Handle formatting option selection
  const handleFormatOption = (optionId) => {
    console.log(`Selected option: ${optionId} for text: ${selectedText}`);
    // Keep toolbar visible when selecting formatting options
    // Only hide when clicking outside or choosing a dropdown option
  };

  // Close toolbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.formatting-toolbar') && 
          window.getSelection().toString().trim().length === 0) {
        setShowFormattingToolbar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mouseup', handleContentMouseUp);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mouseup', handleContentMouseUp);
    };
  }, []);
  
  const handleQuerySubmit = (e) => {
    e && e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Add user question to conversation
    const newConversation = [
      ...conversation,
      {
        type: 'user',
        message: searchQuery,
      }
    ];
    
    setConversation(newConversation);
    setShowInitialState(false);
    setIsSearching(true);
    
    // Simulate AI searching and responding
    setTimeout(() => {
      if (searchQuery.toLowerCase().includes('refund')) {
        setConversation([
          ...newConversation,
          {
            type: 'ai',
            message: 'Searching for relevant sources...',
            isSearching: true
          }
        ]);
        
        setTimeout(() => {
          setShowSourceCard(true);
          setIsSearching(false);
          setShowRefundSources(true);
          
          setTimeout(() => {
            // Remove 'Searching for relevant sources...' from conversation before adding refund response
            setConversation(prev => {
              // Remove last item if it is isSearching
              let updated = prev;
              if (updated.length > 0 && updated[updated.length-1].isSearching) {
                updated = updated.slice(0, -1);
              }
              return [
                ...updated,
                {
                  type: 'ai',
                  message: 'We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund.',
                  isResponse: true
                }
              ];
            });
          }, 500);
        }, 1000);
        
      } else {
        setConversation([
          ...newConversation,
          {
            type: 'ai',
            message: 'Searching for relevant sources...',
            isSearching: true
          },
          {
            type: 'ai',
            message: "I'll help you find information on that topic. Let me check our resources.",
            isResponse: true
          }
        ]);
        setIsSearching(false);
      }
      setSearchQuery('');
    }, 1000);
  };
  
  const handleSuggestedQuestion = (question) => {
  setSearchQuery(question);
  setInputPlaceholder("Ask a follow-up question..."); // 👈 update placeholder
  setShowSuggestedText(false); // 👈 hide suggested message
  if (contentRef.current) contentRef.current.scrollTop = 0;

  setTimeout(() => {
    handleQuerySubmit();
  }, 100);
};


{showSuggestedText && (
  <div 
    className="text-sm text-blue-600 cursor-pointer hover:underline"
    onClick={() => handleSuggestedQuestion("How do I get a refund?")}
  >
    Suggested: How do I get a refund?
  </div>
)}


  const handleAddToComposer = (customText) => {
    // If customText is provided, use that, otherwise use default text
    // Ensure we're always setting a string value
    const textToAdd = (customText || `We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund.

To assist you with your refund request, could you please provide your order ID and proof of purchase.

Once I've checked these details, if everything looks OK, I will send a returns QR code which you can use to post the item back to us. Your refund will be automatically issued once you put it in the post.`).toString();

    setMessageInput(textToAdd);
    onClose();
  };
  
  const closeArticlePopup = () => {
    setShowArticlePopup(null);
  };
  
  const renderRefundResponse = () => (
    <div
  className="bg-gradient-to-b from-[#f5c5d7] to-[#e1d4f4] rounded-lg p-4 mt-1"
  onMouseUp={handleContentMouseUp}
>
  <p className="text-sm text-gray-800">
    We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund.
  </p>

  <p className="text-sm text-gray-700 mt-3 relative">
    To assist you with your refund request, could you please provide your order ID and proof of purchase.
    <NumberedIcon number="1" onClick={() => toggleSection('details')} />
  </p>

  <p className="text-sm text-gray-700 mt-3 relative">
    Once I've checked these details, if everything looks OK, I will send a returns QR code which you can use to post the item back to us. Your refund will be automatically issued once you put it in the post.
    <NumberedIcon number="2" onClick={() => toggleSection('qrcode')} />
  </p>

  <div className="flex justify-center mt-4 pt-3 border-t border-purple-200">
    <button 
      onClick={() => handleAddToComposer(`We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund.

To assist you with your refund request, could you please provide your order ID and proof of purchase.

Once I've checked these details, if everything looks OK, I will send a returns QR code which you can use to post the item back to us. Your refund will be automatically issued once you put it in the post.`)}
      className="flex items-center justify-center gap-2 text-gray-800 font-medium text-sm bg-white py-2 px-4 rounded border border-gray-300 hover:bg-gray-50 w-full"
    >
      <TfiNewWindow />
      Add to composer
    </button>
  </div>
</div>
  );
 const [activeTab, setActiveTab] = useState('copilot');
 
  
  return (
   <div className="h-full flex flex-col bg-gradient-to-br from-white to-purple-50/30" ref={contentRef}>
  {/* Header */}
  <div className="flex items-center justify-between p-4 border-b bg-white">
    <div className="flex items-center space-x-4">

      <button
        onClick={() => setActiveTab('copilot')}
        className={`group relative pb-2 text-md font-semibold flex items-center space-x-2 ${
          activeTab === 'copilot'
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600'
            : 'text-gray-500'
        }`}
      >
        <FaIntercom
          className={`text-1xl transition-colors duration-300 ${
            activeTab === 'copilot' ? 'text-[#692c75]' : 'text-gray-500'
          }`}
        />
        <span>AI Copilot</span>

        {activeTab === 'copilot' && (
          <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>
        )}
      </button>

      <button
        onClick={() => setActiveTab('details')}
        className={`relative pb-2 text-md font-semibold ${
          activeTab === 'details'
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600'
            : 'text-gray-500 '
        }`}
      >
        Details
        {activeTab === 'details' && (
          <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>
        )}
      </button>

    </div>
    <button onClick={onClose} className="text-gray-500">
      <LuPanelRightClose className="text-1xl" />
    </button>
  </div>

  {/* Main Content */}
  
  <div
    className="flex-1 overflow-y-auto p-4 flex flex-col relative"
    onMouseUp={handleContentMouseUp}
    style={{
      backgroundImage: `
        linear-gradient(to right, rgba(115, 103, 240, 0.15), rgba(255, 131, 85, 0.15)),
        linear-gradient(to bottom, white, transparent 70%)
      `,
      backgroundBlendMode: 'screen',
    }}
  >
    {showInitialState && conversation.length === 0 ? (
      /* Initial state - AI Assistant Intro */
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="flex items-center justify-center mx-auto mb-3">
            <FaIntercom className="text-black text-4xl" />
          </div>

          <h3 className="font-medium text-gray-900">Hi, I'm Fin AI Copilot</h3>
          <p className="text-sm text-gray-500 mt-1">Ask me anything from this conversation.</p>
        </div>
      </div>
    ) : (
      /* Conversation View */
      <div className="flex-1">
        {conversation.map((item, index) => (
          <div key={index} className="mb-4">
            {item.type === 'user' ? (
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">You</span>
                </div>
                <div>
                  <p className="text-sm font-medium">You</p>
                  <p className="text-sm">{item.message}</p>
                </div>
              </div>
            ) : item.isSearching ? (
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">Fin</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Fin</p>
                  <p className="text-sm text-gray-500">{item.message}</p>
                </div>
              </div>
            ) : item.isResponse ? (
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">Fin</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Fin</p>

                  {item.message.toLowerCase().includes('refund') ? (
                    renderRefundResponse()
                  ) : (
                    <div
                      className="bg-white border rounded-lg p-3 mt-1"
                      onMouseUp={handleContentMouseUp}
                    >
                      <p className="text-sm">{item.message}</p>
                    </div>
                  )}

                  {showSourceCard && index === conversation.length - 1 && showRefundSources && (
                    <RefundSources onAddToComposer={handleAddToComposer} />
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ))}

        {isSearching && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500"></div>
          </div>
        )}
      </div>
    )}

    {/* Footer with suggestions and input */}
   <div>
  {/* Suggested Question Prompt - shown conditionally */}
  {showSuggestedText && (
    <div
      className="mb-4 inline-flex items-center space-x-3 bg-white px-4 py-2 rounded shadow-sm
                 text-gray-600 cursor-pointer transition-colors group
                 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-50"
    >
      <div className="flex items-center space-x-2">
        <span className="text-md font-semibold text-gray-800 group-hover:text-indigo-900">
          Suggested
        </span>
        <span className="text-gray-500 group-hover:text-indigo-900 text-lg">
          <FcMoneyTransfer />
        </span>
      </div>

      <button
        onClick={() => handleSuggestedQuestion('How do I get a refund?')}
        className="text-md font-normal text-gray-600 group-hover:text-indigo-900 hover:underline"
      >
        How do I get a refund?
      </button>
    </div>
  )}

  {/* Input Field */}
  <form
    onSubmit={handleQuerySubmit}
    className="relative pt-2 border-t border-gray-200"
  >
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder={inputPlaceholder}
      className="w-full p-3 pr-10 border rounded-lg bg-white placeholder-gray-400 
                 focus:outline-none focus:ring-1 focus:ring-gray-300"
    />

    {/* Search Icon Button */}
    <button
      type="submit"
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    </button>
  </form>
</div>

  </div>

  {/* Popup Dialog */}
  {showArticlePopup && (
    <ArticlePopup title={showArticlePopup.title} content={showArticlePopup.content} onClose={closeArticlePopup} onAddToComposer={handleAddToComposer} />
  )}

  {/* Formatting Toolbar */}
  {showFormattingToolbar && selectedText && (
    <FormattingToolbar position={toolbarPosition} onClose={() => setShowFormattingToolbar(false)} onOptionSelect={handleFormatOption} />
  )}
</div>

  );
};

export default AICopilot;