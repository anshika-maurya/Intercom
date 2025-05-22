import React, { useState, useEffect } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';


const toneOptions = [
  { id: 'professional', label: 'Professional', description: 'Clear, formal, and business-appropriate' },
  { id: 'friendly', label: 'Friendly', description: 'Warm, approachable, and conversational' },
  { id: 'empathetic', label: 'Empathetic', description: 'Understanding, supportive, and compassionate' }
];

const dummySuggestions = [
  {
    id: 1,
    message: "I understand you're concerned about your order. I can see that it's currently in transit and scheduled for delivery tomorrow between 9 AM and 5 PM. You'll receive a notification via email and SMS when it's out for delivery.",
    tone: 'Professional'
  },
  {
    id: 2,
    message: "Hey there! No worries about your order - I've got good news! It's on its way and should reach you tomorrow between 9 AM and 5 PM. We'll send you a heads-up when it's out for delivery!",
    tone: 'Friendly'
  },
  {
    id: 3,
    message: "I completely understand your concern about the order. I want to assure you that it's safely in transit and will be delivered tomorrow between 9 AM and 5 PM. To give you peace of mind, we'll notify you as soon as it's out for delivery.",
    tone: 'Empathetic'
  }
];

const features = [
  {
    id: 1,
    title: 'Context-Aware',
    description: 'Pulling context from your public health content and even from previous conversations.',
    icon: '📚'
  },
  {
    id: 2,
    title: 'One-Click Add',
    description: 'You can add the answer to the composer in just one click and quickly personalize it using AI too.',
    icon: '🎯'
  },
  {
    id: 3,
    title: 'Smart Summary',
    description: 'AI-generated summary to catch up quickly.',
    icon: '📋'
  }
];

const dummyRefundSources = [
  {
    id: 1,
    type: 'Public article',
    author: 'Amy Adams',
    time: '1d ago',
    title: 'Getting a refund',
    content: "We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund. This guide outlines the simple steps to help you navigate the refund process and ensure a smooth resolution to your concern."
  },
  {
    id: 2,
    type: 'Conversation',
    author: 'Theresa Eds',
    time: '3d ago',
    title: 'Refund for an unwanted gift',
    content: "Unfortunately, we're only able to process refunds for orders that were placed within the last 60 days. Your order was placed well past the cut off date."
  }
];

export default function CopilotPanel({ onClose, setMessageInput }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('copilot');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [selectedTone, setSelectedTone] = useState('professional');
  const [showFeatures, setShowFeatures] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsGenerating(true);
    setShowFeatures(false);
    
    // Simulate AI response generation
    setTimeout(() => {
      setAiResponse({
        message: "Based on the customer's query about a refund for an unopened Christmas gift purchased in November, here's a suggested response:",
        suggestions: dummySuggestions,
        sourceType: 'internal',
        confidence: 'high'
      });
      setIsGenerating(false);
    }, 1000);
  };

  const handleSuggestedQuestion = (question) => {
    setSearchQuery(question);
    handleSearch({ preventDefault: () => {} });
  };

  const handleAddToComposer = (text) => {
    setMessageInput(text);
    onClose();
  };

  const handleToneChange = (tone) => {
    setSelectedTone(tone);
    // In a real app, you would regenerate the response with the new tone
  };

  const resetSearch = () => {
    setSearchQuery('');
    setAiResponse(null);
    setShowFeatures(true);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-purple-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setActiveTab('copilot')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'copilot' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent'
            }`}
          >
            AI Copilot
          </button>
          <button 
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent'
            }`}
          >
            Details
          </button>
        </div>
        <button onClick={onClose} className="p-2">
          <span className="px-3 py-1 text-sm bg-gray-900 text-white rounded-md">Close</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* AI Assistant Intro */}
        <div className="flex items-start space-x-3 mb-6">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm">F</span>
          </div>
          <div>
            <h3 className="text-base font-medium">Hi, I'm Fin AI Copilot</h3>
            <p className="text-sm text-gray-500">I can help you draft responses and find information.</p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask me anything about this conversation..."
              className="w-full p-3 pr-10 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Features Showcase */}
        {showFeatures && (
          <div className="space-y-6">
            {/* Suggested Questions */}
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-2">Suggested questions</div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleSuggestedQuestion("Help me draft a refund response")}
                  className="text-sm text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full"
                >
                  Help me draft a refund response
                </button>
                <button 
                  onClick={() => handleSuggestedQuestion("Summarize this conversation")}
                  className="text-sm text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full"
                >
                  Summarize this conversation
                </button>
                <button 
                  onClick={() => handleSuggestedQuestion("Make this sound more friendly")}
                  className="text-sm text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full"
                >
                  Make this sound more friendly
                </button>
              </div>
            </div>
            
            {/* Feature List */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-4">Fin AI helps you...</h4>
              <div className="space-y-4">
                {features.map(feature => (
                  <div key={feature.id} className="flex items-start space-x-3">
                    <div className="text-xl">{feature.icon}</div>
                    <div>
                      <h5 className="font-medium text-gray-900">{feature.title}</h5>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-sm text-gray-500">Generating response...</p>
          </div>
        )}

        {/* AI Response */}
        {aiResponse && !isGenerating && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Response</h4>
              <button 
                onClick={resetSearch} 
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Clear</span>
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              {/* Source Tag */}
              <div className="mb-3 flex items-center">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">
                  {aiResponse.sourceType === 'internal' ? 'Internal content' : 'Public content'}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {aiResponse.confidence === 'high' ? 'High confidence' : 'Medium confidence'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{aiResponse.message}</p>
              
              {/* Tone Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {toneOptions.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => handleToneChange(tone.id)}
                      className={`p-2 text-sm rounded-lg border ${
                        selectedTone === tone.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggested Responses */}
              <div className="space-y-4">
                {aiResponse.suggestions.map((suggestion) => (
                  <div 
                    key={suggestion.id} 
                    className={`p-3 rounded-lg border ${
                      suggestion.tone.toLowerCase() === selectedTone ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">{suggestion.tone}</span>
                      <button
                        onClick={() => handleAddToComposer(suggestion.message)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1 rounded border border-indigo-200"
                      >
                        Add to composer
                      </button>
                    </div>
                    <p className="text-sm text-gray-700">{suggestion.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Formatting Tools */}
      {setMessageInput && (
        <div className="border-t bg-white p-2">
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 relative group">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 bg-white border rounded-lg shadow-lg py-1">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Make more friendly
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Make more formal
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Fix spelling & grammar
                </button>
              </div>
            </button>
            <button className="p-2 font-bold text-gray-500 hover:text-gray-700">B</button>
            <button className="p-2 italic text-gray-500 hover:text-gray-700">I</button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
