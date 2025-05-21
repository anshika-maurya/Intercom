import React from 'react';

const UserAvatar = () => (
  <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
    <span className="text-white text-xs">You</span>
  </div>
);

const AIAvatar = () => (
  <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
    <span className="text-white text-xs">AI</span>
  </div>
);

const CopilotActiveConversation = ({ conversation }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Conversation */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* User question */}
        <div className="flex items-start space-x-3 mb-4">
          <UserAvatar />
          <div>
            <p className="text-sm font-medium">You</p>
            <p className="text-sm">How do I get a refund?</p>
          </div>
        </div>
        
        {/* AI response */}
        <div className="flex items-start space-x-3 mb-2">
          <AIAvatar />
          <div>
            <p className="text-sm font-medium">Fin</p>
            <p className="text-sm text-gray-500">Searching for relevant sources...</p>
          </div>
        </div>
        
        {/* AI source */}
        <div className="flex items-start space-x-3 ml-10 mb-4">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center">
              <span className="inline-block mr-2 text-lg">📄</span>
              <p className="text-sm font-medium">Getting a refund</p>
            </div>
          </div>
        </div>
        
        {/* Full AI response will appear here when ready */}
      </div>
    </div>
  );
};

export default CopilotActiveConversation; 