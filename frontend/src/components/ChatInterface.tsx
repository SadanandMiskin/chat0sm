
import React, { useState, useEffect, useRef } from 'react';
import { Send, Menu, Plus, LogOut, Pen, Save, ShieldClose, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import EmptyState from './EmptyState';
import { API_URL } from '../services/api';

interface Message {
  role: 'user' | 'system';
  content: string;
}

interface Chat {
  _id: string;
  title: string;
  messages: Message[];
}

const ChatInterface: React.FC = () => {
  const { token, logout } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [typingEffect, setTypingEffect] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(currentChat?.title || 'New Chat');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const LoadingDots = () => (
  <div className="flex items-center space-x-1">
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
  </div>
);

  const renderLoadingState = () => {
    // const getLoadingEmoji = () => {
    //   switch (status) {
    //     case 'thinking': return '🤔';
    //     case 'processing': return '⚡';
    //     case 'framing': return '🎯';
    //     default: return '💭';
    //   }
    // };

    return (
      <div className="flex items-center gap-2 text-gray-600 py-2 p-4">
        <img
          src="p.png" // replace with your image URL
          alt="Loading"
          className="w-7 h-6 loading-icon"
        />
        <span className="font-bold text-xl">{status}</span>
        <LoadingDots />
      </div>
    );
  };
  useEffect(() => {
    let currentIndex = 0;
    const states = ['Chat0sm is thinking...', 'Chat0sm is processing...', 'Chat0sm is framing...'];

    const intervalId = setInterval(() => {
      setStatus(states[currentIndex]);
      currentIndex = (currentIndex + 1) % states.length;
    }, 3000);

    fetchChats();

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat, typingEffect]);

  const fetchChats = async () => {
    try {
      const response = await axios.get<Chat[]>(`${API_URL}/chat/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(response.data || []);
      if (response.data.length && !currentChat) {
        setCurrentChat(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await axios.post<Chat>(
        `${API_URL}/chat/create`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentChat(response.data);
      fetchChats();
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const simulateTypingEffect = (responseContent: string) => {
    let index = 0;
    setTypingEffect('');
    const interval = setInterval(() => {
      if (index < responseContent.length) {
        setTypingEffect((prev) => prev + responseContent[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 5);
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = { role: 'user', content: message };
    setCurrentChat((prevChat) => {
      if (!prevChat) return null;
      return { ...prevChat, messages: [...prevChat.messages, newMessage] };
    });

    setMessage('');
    setIsLoading(true);
    // setLoadingMessage(status);

    try {
      const response = await axios.post<Chat>(
        `${API_URL}/chat/message`,
        {
          chatId: currentChat?._id,
          message: newMessage.content,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.messages.length > 0) {
        const systemMessage = response.data.messages[response.data.messages.length - 1];
        simulateTypingEffect(systemMessage.content);

        setTimeout(() => {
          setCurrentChat((prevChat) => {
            if (!prevChat) return null;
            return { ...prevChat, messages: [...prevChat.messages, systemMessage] };
          });
          setTypingEffect('');
        }, systemMessage.content.length * 50);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      // setLoadingMessage('');
    }
  };




  const renderContent = (content: string) => {
    const markdownPatterns = {
      bold: /\*\*(.*?)\*\*/g,
      italic: /\*(.*?)\*/g,
      link: /\[([^\]]+)\]\(([^)]+)\)/g,
      image: /!\[([^\]]*)\]\(([^)]+)\)/g,
      code: /```([\s\S]*?)```/g,
      inlineCode: /`([^`]+)`/g,
      blockquote: />\s*(.*)/g,
      unorderedList: /- (.*)/g,
      orderedList: /\d+\. (.*)/g,
      heading: /^(#{1,3})\s*(.*)$/gm,
      newline: /\n/g,
    };

    const contentWithReplacements = content
      .replace(markdownPatterns.image, (_, alt, src) => (
        `<div class="image-container my-1 max-w-xl group">
          <img alt="${alt}" src="${src}" class="w-full h-auto rounded-lg shadow-lg group-hover:scale-102 transform transition duration-200 ease-out" loading="lazy" />
        </div>`
      ))
      .replace(markdownPatterns.code, (_, code) => (
        `<pre class="bg-gradient-to-br from-gray-900 to-black text-white p-2.5 rounded-md my-1.5 overflow-x-auto border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <code class="font-mono text-sm">${code}</code>
        </pre>`
      ))
      .replace(markdownPatterns.inlineCode, (_, code) => (
        `<code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-md font-mono text-sm border border-gray-200 hover:bg-gray-200 transition-colors duration-150">${code}</code>`
      ))
      .replace(markdownPatterns.link, (_, text, url) => (
        `<a href="${url}" class="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-150 ease-in-out" target="_blank" rel="noopener noreferrer">${text}</a>`
      ))
      .replace(markdownPatterns.bold, (_, text) =>
        `<strong class="font-bold text-gray-900">${text}</strong>`
      )
      .replace(markdownPatterns.italic, (_, text) =>
        `<em class="italic text-gray-700">${text}</em>`
      )
      // .replace(markdownPatterns.blockquote, (_, text) => (
      //   `<blockquote class="border-l-4 border-blue-500 pl-3 py-0.5 my-1 text-gray-700 bg-blue-50 rounded-r-lg italic transform hover:translate-x-1 transition-transform duration-200">${text}</blockquote>`
      // ))
      // .replace(markdownPatterns.unorderedList, (_, text) => (
      //   `<ul class="list-disc pl-4 space-y-0.5 marker:text-blue-500"><li class="hover:translate-x-1 transition-transform duration-150">${text}</li></ul>`
      // ))
      // .replace(markdownPatterns.orderedList, (_, text) => (
      //   `<ol class="list-decimal pl-4 space-y-0.5 marker:text-blue-500"><li class="hover:translate-x-1 transition-transform duration-150">${text}</li></ol>`
      // ))
      .replace(markdownPatterns.heading, (_, hashes, text) => {
        const level = hashes.length as 1 | 2 | 3;
      const sizes: { [key in 1 | 2 | 3]: string } = {
        1: 'text-2xl',
        2: 'text-xl',
        3: 'text-lg',
      };
        return `<h${level} class="${sizes[level]} font-bold text-gray-900 border-b border-gray-200 pb-1 hover:text-blue-700 transition-colors duration-200">${text}</h${level}>`;
      })
      .replace(markdownPatterns.newline, () => '<br class="my-0.5" />');

    return (
      <div
        className="prose prose-sm max-w-none space-y-1.5 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: contentWithReplacements }}
      />
    );
  };



  const handleEditTitle = () => {
    setIsEditing(true);
  };

  const handleSaveTitle = async () => {
    if (!newTitle || newTitle === currentChat?.title) {
      // If there's no change or the title is empty, do nothing
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/chat/changechat`,
        { chatId: currentChat?._id, chatTitle: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      console.log(data);
      setNewTitle(data.title); // Update the title after successful API call
      setCurrentChat((prevChat) =>
        prevChat ? { ...prevChat, title: data.title } : prevChat
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false); // Exit edit mode
    }
  };

  const handleClose = () => {
   setIsEditing(false)
  };

  const NoChatsMessage = () => (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-4">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md max-w-md">
        <p className="font-bold">Welcome to Chat0sm!</p>
        <p className="mt-2">To get started, please create a new chat using the "New Chat" button in the menu.</p>
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="mt-4 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors inline-flex items-center gap-2"
          >
            <Menu size={20} />
            Open Menu
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-300/50 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 md:translate-x-0 md:static`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <button
              onClick={createNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Plus size={20} />
              New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <button
                key={chat._id}
                onClick={() => setCurrentChat(chat)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                  currentChat?._id === chat._id ? 'bg-gray-400' : 'text-black'
                }`}
              >
                {chat.title || 'New Chat'}
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-3 text-black hover:bg-white rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
      {isSidebarOpen && (
    <div
      className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
      onClick={() => setIsSidebarOpen(false)} // Close sidebar on overlay click
    />
  )}
      <div className="flex-1 flex flex-col w-dvw ">
      <header className="bg-white border-b border-gray-200 p-4 pt- ">
          <div className="flex items-center justify-between gap-5 max-w-6xl mx-auto">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className='flex flex-row gap-2 items-center justify-start'>
            {isEditing ? (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="border border-gray-300 rounded-lg p-2"
              />
            ) : (
              <h1 className="text-xl font-semibold text-gray-800">{currentChat?.title}</h1>
            )}
            {isEditing ? (
              <>
              <button
                onClick={handleSaveTitle}
                disabled={!newTitle || newTitle === currentChat?.title}
                className={`px-1 py-1 rounded-lg text-white ${
                  !newTitle || newTitle === currentChat?.title
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Save />
              </button>
              <button
                onClick={handleClose}
                disabled={!newTitle || newTitle === currentChat?.title}
                className={`px-1 py-1 rounded-lg text-white ${
                  !newTitle || newTitle === currentChat?.title
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <ShieldClose />
              </button>
              </>
            ) : (
              <button
                onClick={handleEditTitle}
                className="px-1 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <Pen />
              </button>
            )}

            </div>
            <div className='flex items-center justify-center '>
            <img src='p.png'
              className='w-9 '
            />
            <h1 className='font-bold'>Chat0sm</h1>
            </div>
          </div>
        </header>


        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
              {!chats.length ? (
                <NoChatsMessage />
              ) : (
                currentChat?.messages?.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    {currentChat?.messages?.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} items-start gap-4`}
                      >
                          {msg.role == 'user' ? <User/> : <></>}

                        <div
                          className={`max-w-[85%] px-6 py-4 rounded-2xl ${
                            msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white shadow-sm border border-gray-200'
                          }`}
                        >
                          {renderContent(msg.content)}
                        </div>
                        {msg.role == 'user' ? <></> : <><img src='p.png' className='w-6'/></>}

                      </div>
                    ))}
                  </>
                )
              )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-lg px-6 py-4 rounded-xl bg-white text-gray-800 shadow-md rounded-bl-none">
                  <p className="whitespace-pre-wrap break-words animate-pulse">{renderLoadingState()}</p>
                </div>
              </div>
            )}
            {typingEffect && (
              <div className="flex justify-end items-start gap-4">

                <div className="max-w-[85%] px-6 py-4 rounded-2xl bg-white shadow-sm border border-gray-200">

                  {renderContent(typingEffect)}
                </div>
             <><img src='p.png' className='w-6'/></>

              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-gray-200 bg-white p-4">
          <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex items-end gap-4">
            <div className="flex-1 bg-white rounded-2xl border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send a message..."
                rows={1}
                className="w-full px-4 py-3 bg-transparent focus:outline-none resize-none"
                style={{ minHeight: '44px', maxHeight: '200px' }}
                disabled={!chats.length}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !message.trim() || !chats.length}
              className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
