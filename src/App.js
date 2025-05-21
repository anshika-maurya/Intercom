import React, { useState } from 'react';
import InboxLayout from './InboxLayout';
import InboxSidebar from './InboxSidebar';
import ChatPanel from './ChatPanel';
import AICopilot from './components/AICopilot';

function App() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);
  
  const handleSendMessage = () => {
    // In a real app, this would send the message to an API
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  const handleOpenCopilot = () => {
    setIsCopilotOpen(true);
  };

  const handleCloseCopilot = () => {
    setIsCopilotOpen(false);
  };

  return (
    <InboxLayout
      sidebar={
        <InboxSidebar 
          selectedChat={selectedChat} 
          onSelectChat={setSelectedChat} 
        />
      }
      mainContent={
        <ChatPanel 
          selectedChat={selectedChat}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          onSendMessage={handleSendMessage}
          onOpenCopilot={handleOpenCopilot}
        />
      }
      rightPanel={
        isCopilotOpen ? (
          <AICopilot 
            onClose={handleCloseCopilot} 
            setMessageInput={setMessageInput}
          />
        ) : null
      }
    />
  );
}

export default App;