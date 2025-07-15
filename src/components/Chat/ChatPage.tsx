import React, { useState } from 'react';
import { Send, Search, Phone, Video, MoreHorizontal, Paperclip, Smile, Menu, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../store/AppStore';

interface ChatPageProps {
  onToggleSidebar?: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onToggleSidebar }) => {
  const [activeChat, setActiveChat] = useState(1);
  const [message, setMessage] = useState('');
  const [showChatView, setShowChatView] = useState(false);

  const { chats } = useAppStore();

  const activeClient = chats.find(chat => chat.id === activeChat);
  const messages = activeClient?.messages || [];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add message logic here
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleChatSelect = (chatId: number) => {
    setActiveChat(chatId);
    setShowChatView(true);
  };

  const handleBackToList = () => {
    setShowChatView(false);
    setActiveChat(0);
  };

  return (
    <div className="p-4 lg:p-6 h-screen lg:h-[calc(100vh-8rem)]">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Messages</h1>
        </div>
      </div>
      
      <div className="h-[calc(100vh-8rem)] lg:h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex h-full">
          {/* Chat List */}
          <div className={`w-full lg:w-80 border-r border-slate-200 flex flex-col ${showChatView ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-base lg:text-lg font-semibold text-slate-900 mb-3 hidden lg:block">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm lg:text-base"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  className={`p-3 lg:p-4 cursor-pointer border-b border-slate-100 hover:bg-slate-50 ${
                    activeChat === chat.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm lg:text-base">
                        {chat.avatar}
                      </div>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-slate-900 truncate text-sm lg:text-base">{chat.clientName}</h3>
                        <span className="text-xs text-slate-500">{chat.timestamp}</span>
                      </div>
                      <p className="text-xs lg:text-sm text-slate-600 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="w-4 h-4 lg:w-5 lg:h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">{chat.unreadCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Content */}
          <div className="hidden lg:flex flex-1 flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {activeClient?.avatar}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{activeClient?.clientName}</h3>
                  <p className="text-sm text-slate-500">
                    {activeClient?.online ? 'Online' : 'Last seen 2 hours ago'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'admin'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'admin' ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-slate-600" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm lg:text-base"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded">
                    <Smile className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Chat View */}
          <div className={`lg:hidden flex-1 flex flex-col h-full ${showChatView ? 'flex' : 'hidden'}`}>
            {activeChat && showChatView && (
              <>
                {/* Mobile Chat Header */}
                <div className="p-3 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={handleBackToList}
                      className="p-1 text-slate-600 hover:text-slate-900"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {activeClient?.avatar}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 text-sm">{activeClient?.clientName}</h3>
                      <p className="text-xs text-slate-500">
                        {activeClient?.online ? 'Online' : 'Last seen 2 hours ago'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                      <Phone className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                      <Video className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Mobile Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-lg ${
                          msg.sender === 'admin'
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === 'admin' ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Message Input */}
                <div className="p-3 border-t border-slate-200 flex-shrink-0 bg-white">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <Paperclip className="w-4 h-4 text-slate-600" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;