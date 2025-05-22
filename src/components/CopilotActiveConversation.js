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
      <div className="flex-1 overflow-y-auto pb-4">
        {conversation?.messages?.map((msg, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-start space-x-3">
              {msg.sender === 'user' ? <UserAvatar /> : <AIAvatar />}
              <div>
                <p className="text-sm font-medium">{msg.sender === 'user' ? 'You' : 'Fin'}</p>
                <p className="text-sm text-gray-700">{msg.text}</p>
              </div>
            </div>

            {/* Optional: Render sources if available */}
            {msg.sender === 'AI' && msg.sources?.length > 0 && (
              <div className="ml-10 mt-2 space-y-2">
                {msg.sources.map((source, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center">
                      <span className="inline-block mr-2 text-lg">📄</span>
                      <p className="text-sm font-medium">{source.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CopilotActiveConversation;
