// import React, { useState, useEffect, useRef } from 'react';
// import { Send, Menu, Plus, LogOut } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
// import axios from 'axios';

// interface Message {
//   role: 'user' | 'system';
//   content: string;
// }

// interface Chat {
//   _id: string;
//   title: string;
//   messages: Message[];
// }

// const ChatInterface: React.FC = () => {
//   const { token, logout } = useAuth();
//   const [message, setMessage] = useState<string>('');
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [currentChat, setCurrentChat] = useState<Chat | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
//   const [loadingMessage, setLoadingMessage] = useState<string>('');
//   const [typingEffect, setTypingEffect] = useState<string>('');
//   const [status, setStatus] = useState<string>('Percepta is thinking...');
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     let currentIndex = 0;
//     const states = [
//       'Percepta is thinking...',
//       'Percepta is processing...',
//       'Percepta is framing...'
//     ];

//     const intervalId = setInterval(() => {
//       setStatus(states[currentIndex]);
//       currentIndex = (currentIndex + 1) % states.length;
//     }, 3000);

//     fetchChats();

//     return () => clearInterval(intervalId);
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [currentChat, typingEffect]);

//   const fetchChats = async () => {
//     try {
//       const response = await axios.get<Chat[]>('http://localhost:3000/api/chat/list', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setChats(response.data || []);
//       if (response.data.length && !currentChat) {
//         setCurrentChat(response.data[0]);
//       }
//     } catch (error) {
//       console.error('Error fetching chats:', error);
//     }
//   };

//   const createNewChat = async () => {
//     try {
//       const response = await axios.post<Chat>(
//         'http://localhost:3000/api/chat/create',
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setCurrentChat(response.data);
//       fetchChats();
//     } catch (error) {
//       console.error('Error creating chat:', error);
//     }
//   };

//   const simulateTypingEffect = (responseContent: string) => {
//     let index = 0;
//     setTypingEffect('');
//     const interval = setInterval(() => {
//       if (index < responseContent.length) {
//         setTypingEffect((prev) => prev + responseContent[index]);
//         index++;
//       } else {
//         clearInterval(interval);
//       }
//     }, 5);
//   };

//   const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!message.trim()) return;

//     const newMessage: Message = { role: 'user', content: message };
//     setCurrentChat((prevChat) => {
//       if (!prevChat) return null;
//       return {
//         ...prevChat,
//         messages: [...prevChat.messages, newMessage],
//       };
//     });

//     setMessage('');
//     setIsLoading(true);
//     setLoadingMessage(status);

//     try {
//       const response = await axios.post<Chat>(
//         'http://localhost:3000/api/chat/message',
//         {
//           chatId: currentChat?._id,
//           message: newMessage.content,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.messages.length > 0) {
//         const systemMessage = response.data.messages[response.data.messages.length - 1];

//         // Start typing effect first
//         simulateTypingEffect(systemMessage.content);

//         // Wait for typing effect to complete before updating chat
//         setTimeout(() => {
//           setCurrentChat((prevChat) => {
//             if (!prevChat) return null;
//             return {
//               ...prevChat,
//               messages: [...prevChat.messages, systemMessage],
//             };
//           });
//           setTypingEffect('');
//         }, systemMessage.content.length * 50); // Match the typing effect delay
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setIsLoading(false);
//       setLoadingMessage('');
//     }
//   };


//   // const LoadingSpinner = () => (
//   //   <div className="flex items-center justify-center p-4">
//   //     <div className="relative">
//   //       <Loader className="w-8 h-8 animate-spin text-indigo-600" />
//   //       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
//   //     </div>
//   //   </div>
//   // );

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-lg shadow-2xl transform ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } transition-all duration-300 ease-out md:translate-x-0 md:static`}
//       >
//         <div className="flex flex-col h-full">
//           <div className="p-6">
//             <button
//               onClick={createNewChat}
//               className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 hover:scale-105 transform"
//             >
//               <Plus size={20} />
//               New Adventure
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto px-4">
//             {chats.map((chat) => (
//               <button
//                 key={chat._id}
//                 onClick={() => setCurrentChat(chat)}
//                 className={`w-full p-4 text-left hover:bg-white rounded-xl transition-all duration-300 mb-2 ${
//                   currentChat?._id === chat._id
//                     ? 'bg-white shadow-lg shadow-indigo-100 scale-105'
//                     : 'hover:scale-102'
//                 }`}
//               >
//                 <p className="truncate text-sm font-medium">{chat.title}</p>
//               </button>
//             ))}
//           </div>

//           <div className="p-6">
//             <button
//               onClick={logout}
//               className="w-full flex items-center justify-center gap-2 px-6 py-3 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:shadow-md"
//             >
//               <LogOut size={20} />
//               Beam Out
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
//         <header className="bg-white/80 backdrop-blur-lg shadow-sm p-6">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//               className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-all duration-300"
//             >
//               <Menu size={24} />
//             </button>
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               Cosmic Chat
//             </h1>
//             <div className="w-8" />
//           </div>
//         </header>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-6">
//           <div className="max-w-4xl mx-auto w-full">
//             {currentChat?.messages?.map((msg, index) => (
//               <div
//               key={index}
//               className={`flex ${
//                 msg.role === 'user' ? 'justify-end' : 'justify-start'
//               }`}
//             >
//               <div
//                 className={`max-w-lg px-6 py-4 rounded-xl ${
//                   msg.role === 'user'
//                     ? 'bg-indigo-600 text-white rounded-br-none'
//                     : 'bg-white text-gray-800 shadow-md rounded-bl-none'
//                 }`}
//               >
//                 <p className="whitespace-pre-wrap break-words">
//                   {msg.content}
//                 </p>
//               </div>
//             </div>
//           ))}
//           {isLoading && (
//             <div className="flex justify-start">
//               <div className="max-w-lg px-6 py-4 rounded-xl bg-white text-gray-800 shadow-md rounded-bl-none">
//                 <p className="whitespace-pre-wrap break-words animate-pulse">
//                   {loadingMessage}
//                 </p>
//               </div>
//             </div>
//           )}
//           {typingEffect && (
//             <div className="flex justify-start">
//               <div className="max-w-lg px-6 py-4 rounded-xl bg-white text-gray-800 shadow-md rounded-bl-none">
//                 <p className="whitespace-pre-wrap break-words">{typingEffect}</p>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* Message Input */}
//       <div className="p-6 bg-white/80 backdrop-blur-lg shadow-lg">
//         <form
//           onSubmit={sendMessage}
//           className="flex items-center gap-4 max-w-4xl mx-auto"
//         >
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Send a message..."
//             className="flex-1 px-4 py-3 text-gray-800 bg-white border rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//           />
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Send size={20} />
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   </div>
// );
// };

// export default ChatInterface;









import React, { useState, useEffect, useRef } from 'react';
import { Send, Menu, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

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
  const [status, setStatus] = useState<string>('thinking');

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
    const getLoadingEmoji = () => {
      switch (status) {
        case 'thinking': return '🤔';
        case 'processing': return '⚡';
        case 'framing': return '🎯';
        default: return '💭';
      }
    };

    return (
      <div className="flex items-center gap-2 text-gray-600 py-2">
        <span className="animate-pulse">{getLoadingEmoji()}</span>
        <span className="font-medium">Percepta is {status}</span>
        <LoadingDots />
      </div>
    );
  };
  useEffect(() => {
    let currentIndex = 0;
    const states = ['Percepta is thinking...', 'Percepta is processing...', 'Percepta is framing...'];

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
      const response = await axios.get<Chat[]>('http://localhost:3000/api/chat/list', {
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
        'http://localhost:3000/api/chat/create',
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
        'http://localhost:3000/api/chat/message',
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
      blockquote: />\s*(.*)/g, // Handle blockquotes
      unorderedList: /- (.*)/g, // Handle unordered lists
      orderedList: /\d+\. (.*)/g, // Handle ordered lists
      heading: /^(#{1,6})\s*(.*)/g, // Handle headings
    };

    const contentWithReplacements = content
      .replace(markdownPatterns.image, (_, alt, src) => {
        return `<div class="image-container my-4 max-w-2xl">
          <img alt="${alt}" src="${src}" class="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" loading="lazy" />
        </div>`;
      })
      .replace(markdownPatterns.code, (_, code) => {
        return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto"><code>${code}</code></pre> `;
      })
      .replace(markdownPatterns.inlineCode, (_, code) => {
        return `<code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded font-mono text-sm">${code}</code> >`;
      })
      .replace(markdownPatterns.link, (_, text, url) => {
        return `<a href="${url}" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">${text}</a> `;
      })
      .replace(markdownPatterns.bold, (_, text) => `<strong class="font-semibold">${text}</strong>`)
      .replace(markdownPatterns.italic, (_, text) => `<em class="italic">${text}</em>`)
      .replace(markdownPatterns.blockquote, (_, text) => {
        return `<br> <blockquote class="border-l-4 pl-4 my-4 italic text-gray-600">${text}</blockquote>`;
      })
      .replace(markdownPatterns.unorderedList, (_, text) => {
        return `<ul class="list-disc pl-5 my-4"><li>${text}</li></ul> `;
      })
      .replace(markdownPatterns.orderedList, (_, text) => {
        return `<ol class="list-decimal pl-5 my-4"><li>${text}</li></ol>`;
      })
      .replace(markdownPatterns.heading, (_, hashes, text) => {
        const level = hashes.length;
        return ` <h${level} class="text-${level === 1 ? '3xl' : 'xl'} font-semibold mt-6 mb-3">${text}</h${level}> `;
      });

    return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: contentWithReplacements }} />;
  };


  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 md:translate-x-0 md:static`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <button
              onClick={createNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
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
                  currentChat?._id === chat._id ? 'bg-gray-700' : 'text-gray-300'
                }`}
              >
                {chat.title || 'New Chat'}
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col w-dvw">
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{currentChat?.title || 'New Chat'}</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {currentChat?.messages?.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-start'} items-start gap-4`}
              >
                <div
                  className={`max-w-[85%] px-6 py-4 rounded-2xl ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white shadow-sm border border-gray-200'
                  }`}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-lg px-6 py-4 rounded-xl bg-white text-gray-800 shadow-md rounded-bl-none">
                  <p className="whitespace-pre-wrap break-words animate-pulse">{renderLoadingState()}</p>
                </div>
              </div>
            )}
            {typingEffect && (
              <div className="flex justify-start items-start gap-4">
                <div className="max-w-[85%] px-6 py-4 rounded-2xl bg-white shadow-sm border border-gray-200">
                  {renderContent(typingEffect)}
                </div>
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
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
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
