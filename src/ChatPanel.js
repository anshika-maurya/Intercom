import React, { useState, useRef, useEffect } from 'react';
import { MdChat } from 'react-icons/md';
import { RiArrowDropDownLine } from 'react-icons/ri';
import AICopilot from './components/AICopilot';
import AskFinCopilot from './components/AskFinCopilot';
import FormattingToolbar from './components/FormattingToolbar';


const dummyMessages = [
  {
    id: 1,
    sender: 'customer',
    message: "I bought a product from your store in November as a Christmas gift for a relative of mine. It turns out they have something very similar already. I am hoping you'd be able to refund me, as it is un-opened.",
    time: '2m ago',
    name: 'Luis Easton',
    avatar: 'LE',
    isTyping: false
  },
  {
    id: 2,
    sender: 'agent',
    message: 'Let me just look into this for you, Luis.',
    time: '1min',
    seen: true,
    name: 'Support Agent',
    avatar: 'SA',
    isTyping: false
  }
];


const groupMessagesByDate = (messages) => {
  const groups = {};
  messages.forEach(message => {
    const date = message.time; // In a real app, you'd use actual dates
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });
  return groups;
};

export default function ChatPanel({ selectedChat, messageInput, setMessageInput, onSendMessage, onOpenCopilot }) {
  const [isTyping, setIsTyping] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState(null);
  const [showAICopilot, setShowAICopilot] = useState(false);
  const [showQuickQuestion, setShowQuickQuestion] = useState(false);
  const [copilotQuestion, setCopilotQuestion] = useState('');
  const textareaRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (textareaRef.current && !textareaRef.current.contains(e.target) && 
          !e.target.closest('.formatting-toolbar')) {
        setShowFormattingToolbar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const messageGroups = selectedChat ? groupMessagesByDate(dummyMessages) : {};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage();
    }
  };

  
  const getCaretCoordinates = (textarea, position) => {
    const mirror = document.createElement('div');
    const style = window.getComputedStyle(textarea);
    
    const stylesToCopy = [
      'boxSizing', 'width', 'height', 'padding', 'border', 'fontFamily',
      'fontSize', 'fontWeight', 'lineHeight', 'whiteSpace', 'wordWrap'
    ];
    
    stylesToCopy.forEach(prop => {
      mirror.style[prop] = style.getPropertyValue(prop);
    });
    
    mirror.style.position = 'absolute';
    mirror.style.left = '-9999px';
    mirror.style.top = '0';
    mirror.style.visibility = 'hidden';
    mirror.style.overflowWrap = 'break-word';
    
    const textBeforeCursor = textarea.value.substring(0, position);
    mirror.textContent = textBeforeCursor;
    const span = document.createElement('span');
    span.textContent = '.'; 
    mirror.appendChild(span);
    
    document.body.appendChild(mirror);
    const coordinates = {
      top: span.offsetTop + span.offsetHeight,
      left: span.offsetLeft
    };
    document.body.removeChild(mirror);
    
    const textareaRect = textarea.getBoundingClientRect();
    return {
      top: textareaRect.top + coordinates.top - textarea.scrollTop,
      left: textareaRect.left + coordinates.left - textarea.scrollLeft
    };
  };

  // Handle formatting options
  const handleFormatOption = (optionId) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start !== end) {
      let formattedText = messageInput;
      const selectedPortion = messageInput.substring(start, end);
      
      switch (optionId) {
        case 'bold':
          formattedText = messageInput.substring(0, start) + `**${selectedPortion}**` + messageInput.substring(end);
          break;
        case 'italic':
          formattedText = messageInput.substring(0, start) + `*${selectedPortion}*` + messageInput.substring(end);
          break;
        case 'code':
          formattedText = messageInput.substring(0, start) + `\`${selectedPortion}\`` + messageInput.substring(end);
          break;
        case 'link':
          formattedText = messageInput.substring(0, start) + `[${selectedPortion}](url)` + messageInput.substring(end);
          break;
        case 'formal':
        case 'friendly':
        case 'my_tone':
        case 'grammar':
        case 'translate':
          // In a real implementation, these would connect to an AI service
          console.log(`Applying ${optionId} to: ${selectedPortion}`);
          break;
        default:
          break;
      }
      
      setMessageInput(formattedText);
      setShowFormattingToolbar(false);
      
      setTimeout(() => {
        textarea.focus();
        
        // Adjust cursor position based on the formatting applied
        let cursorAdjustment = 0;
        if (optionId === 'bold') cursorAdjustment = 4; // **text**
        else if (optionId === 'italic') cursorAdjustment = 2; // *text*
        else if (optionId === 'code') cursorAdjustment = 2; // `text`
        else if (optionId === 'link') cursorAdjustment = 5; // [text](url)
        
        const newPosition = end + cursorAdjustment;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 10);
    }
  };

  // Handle key up in the textarea to detect keyboard selection
  const handleTextareaKeyUp = (e) => {
    // On specific keys that might modify selection (arrow keys with shift, etc.)
    if ((e.shiftKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) || 
        e.key === 'End' || e.key === 'Home') {
      handleCheckSelection();
    }
  };

  
  const handleCheckSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start !== end) {
      const selection = messageInput.substring(start, end);
      
      try {
        // Try using our custom position calculator for textarea
        const startPos = getCaretCoordinates(textarea, start);
        const endPos = getCaretCoordinates(textarea, end);
          // Position in middle of selection
        const x = startPos.left + ((endPos.left - startPos.left) / 2);
        // Position below the selection
        const y = endPos.top + 10;
        
        setSelectedText(selection);
        setToolbarPosition({ x, y });
        setShowFormattingToolbar(true);
      } catch (error) {
        // Fallback if all else fails
        const textareaRect = textarea.getBoundingClientRect();        setSelectedText(selection);
        setToolbarPosition({ 
          x: textareaRect.left + (textareaRect.width / 2),
          y: textareaRect.top + textareaRect.height + 10
        });
        setShowFormattingToolbar(true);
      }
    } else {
      setShowFormattingToolbar(false);
    }
  };

  // Handle text selection in the textarea
  const handleTextareaMouseUp = () => {
    handleCheckSelection();
  };
  // Handle quick question click
  const handleQuickQuestion = () => {
    setShowAICopilot(true);
    setShowQuickQuestion(false);
  };  // Handle AI Copilot open/close and questions  
  const handleOpenAICopilot = (question = '') => {
    if (onOpenCopilot) {
      onOpenCopilot();
    }
    if (!question && showAICopilot) {
      // Close the panel
      setShowAICopilot(false);
      setCopilotQuestion('');
      setShowFormattingToolbar(false);
      return;
    }

    if (question) {
      // Open with new question
      setShowAICopilot(true);
      setCopilotQuestion(question);
      setShowFormattingToolbar(false);
      setShowQuickQuestion(false);
    }
  };

  if (!selectedChat) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-white to-purple-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">No conversation selected</h3>
          <p className="mt-1 text-sm text-gray-500">Choose a conversation from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }  return (
    <div className="h-full w-full bg-gradient-to-br from-white to-purple-50">
      <div className="flex flex-col w-full h-full bg-white shadow-md overflow-hidden transition-all duration-300">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-medium text-indigo-700">
              {selectedChat.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">{selectedChat.name}</h2>
              <p className="text-sm text-gray-500">Active now</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            <button className="px-3 py-1 text-sm bg-gray-900 text-white rounded-md">
              Close
            </button>
          </div>
        </div>        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="w-full space-y-8">
            {Object.entries(messageGroups).map(([date, messages]) => (
              <div key={date} className="space-y-4">
                <div className="flex justify-center">
                  <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">{date}</span>
                </div>
                {messages.map((msg, idx) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2 max-w-[70%] ${msg.sender === 'agent' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`min-w-[2.5rem] min-h-[2.5rem] rounded-full flex items-center justify-center text-base font-semibold text-white ${msg.sender === 'agent' ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                        {msg.avatar}
                      </div>
                      <div>
                        <div 
                          className={`${msg.sender === 'agent' ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-100'} rounded-lg px-4 py-3 relative group`}
                          data-chat-message="true"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{msg.name}</span>
                            <span className="text-xs text-gray-500">{msg.time}</span>
                          </div>                          <p className="text-sm text-gray-800" data-customer-message={msg.sender === 'customer'}>{msg.message}</p>
                        </div>
                        {msg.seen && (
                          <div className="flex items-center justify-end mt-1">
                            <span className="text-xs text-gray-500">Seen</span>
                            <span className="ml-1">•</span>
                            <span className="text-xs text-gray-500 ml-1">{msg.time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>        {/* Floating Ask AI Copilot Button */}
        <button
          onClick={() => handleOpenAICopilot()}
          className="group fixed bottom-20 right-4 sm:right-6 md:right-8 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 text-white rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-110 active:scale-95 overflow-hidden"
          title="Ask AI Copilot"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center w-full h-full">
            <span className="text-lg sm:text-xl font-semibold">AI</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full group-hover:-translate-y-1 opacity-0 group-hover:opacity-100 text-[8px] sm:text-[10px] whitespace-nowrap transition-all duration-300 bg-black/80 px-2 py-1 rounded-md">
              Ask AI Copilot
            </span>
          </div>
        </button>

        {/* Message Composer */}
        <div className="border-t bg-white px-6 py-4">
          <div className="flex flex-col">            {showQuickQuestion && (              <div 
                className="mx-4 my-2 p-2 rounded-lg border border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  handleOpenAICopilot("How do I get a refund?");
                  setShowQuickQuestion(false);
                }}
              >
                
              </div>
            )}
            
            <div className="flex items-center justify-between mb-2">              <div className="flex items-center">
                <MdChat className="text-xl text-gray-850 relative top-[2px]" />
                <span className="ml-1 text-sm text-gray-850 font-bold">Chat</span>
                <RiArrowDropDownLine className="text-3xl text-gray-850 ml-1" />
              </div>
              {showAICopilot && (
                <button
                  onClick={() => handleOpenAICopilot()}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Close AI Copilot
                </button>
              )}
              
            </div>
            
            <form onSubmit={handleSubmit} className="flex items-end gap-4">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onMouseUp={handleTextareaMouseUp}
                  onKeyUp={handleTextareaKeyUp}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none"
                  rows="4"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  disabled={!messageInput.trim()}
                >
                  Send
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
            </form>
          </div>        </div>          
        {/* Selection popup component - Only show when AI Copilot is not open */} 
        {!showAICopilot && (
          <AskFinCopilot 
            onOpenAICopilot={handleOpenAICopilot}
            setShowQuickQuestion={setShowQuickQuestion}
            setCopilotQuestion={setCopilotQuestion}
          />
        )}        {/* Single AI Copilot Instance */}        
        <div className={`fixed right-0 top-0 h-full w-[400px] z-[100] transform transition-all duration-300 ease-in-out shadow-xl border-l border-gray-100/50 ${
            showAICopilot ? 'translate-x-0 opacity-100 backdrop-blur-sm' : 'translate-x-full opacity-0 pointer-events-none'
          }`}
        >
          {showAICopilot && (
            <AICopilot 
              onClose={() => handleOpenAICopilot()}
              setMessageInput={setMessageInput}
              selectedMessage={copilotQuestion}
            />
          )}
        </div>

        {/* Add formatting toolbar */}
        {showFormattingToolbar && selectedText && (
          <FormattingToolbar 
            position={toolbarPosition}
            onClose={() => setShowFormattingToolbar(false)}
            onOptionSelect={handleFormatOption}
          />
        )}
        
      </div>
    </div>
  );
}
