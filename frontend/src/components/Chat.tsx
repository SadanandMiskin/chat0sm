// import React, { useState, useEffect, useRef } from 'react';
// import { Send, Menu, Plus, LogOut } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
// import axios from 'axios';


import { HLJSApi } from 'highlight.js';

declare global {
  interface Window {
    hljs: HLJSApi;
  }
}


// interface Message {
//   role: 'user' | 'system';
//   content: string;
// }

// interface Chat {
//   _id: string;
//   title: string;
//   messages: Message[];
// }


// const LoadingDots = () => (
//   <div className="flex items-center space-x-1">
//     <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
//     <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
//     <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
//   </div>
// );

// const Chat: React.FC = () => {
//   const { token, logout } = useAuth();
//   const [message, setMessage] = useState<string>('');
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [currentChat, setCurrentChat] = useState<Chat | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
//   const [typingEffect, setTypingEffect] = useState<string>('');
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   // const [loadingMessage, setLoadingMessage] = useState<string>('');
//   const [loadingState, setLoadingState] = useState<string>('thinking');

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };
//   useEffect(() => {
//     let currentState = 0;
//     const states = ['thinking', 'processing', 'framing'];

//     const intervalId = setInterval(() => {
//       setLoadingState(states[currentState]);
//       currentState = (currentState + 1) % states.length;
//     }, 2000);

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
//     // setLoadingMessage(status);

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
//       // setLoadingMessage('');
//     }
//   };
//   // ... (keep existing fetchChats, createNewChat, and other utility functions)

//   const renderLoadingState = () => {
//     const getLoadingEmoji = () => {
//       switch (loadingState) {
//         case 'thinking': return '🤔';
//         case 'processing': return '⚡';
//         case 'framing': return '🎯';
//         default: return '💭';
//       }
//     };

//     return (
//       <div className="flex items-center gap-2 text-gray-600 py-2">
//         <span className="animate-pulse">{getLoadingEmoji()}</span>
//         <span className="font-medium">Percepta is {loadingState}</span>
//         <LoadingDots />
//       </div>
//     );
//   };

//   const renderContent = (content: string) => {
//     const markdownPatterns = {
//       bold: /\*\*(.*?)\*\*/g,
//       italic: /\*(.*?)\*/g,
//       link: /\[([^\]]+)\]\(([^)]+)\)/g,
//       image: /!\[([^\]]*)\]\(([^)]+)\)/g,
//       code: /```([a-z]*)\n([\s\S]*?)```/g,
//       inlineCode: /`([^`]+)`/g,
//     };

//     const contentWithReplacements = content
//       .replace(markdownPatterns.code, (_, language, code) => {
//         const languageClass = language ? `language-${language}` : '';
//         return `
//           <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto">
//             <code class="${languageClass} hljs">
//               ${window.hljs ? window.hljs.highlight(code, { language: language || 'plaintext' }).value : code}
//             </code>
//           </pre>
//         `;
//       })
//       .replace(markdownPatterns.inlineCode, (_, code) => {
//         return `<code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded font-mono text-sm">${code}</code>`;
//       })
//       .replace(markdownPatterns.image, (_, alt, src) => {
//         return `<div class="my-4">
//           <img src="${src}" alt="${alt}" class="rounded-lg max-w-full h-auto" />
//         </div>`;
//       })
//       .replace(markdownPatterns.link, (_, text, url) => {
//         return `<a href="${url}" class="text-blue-600 hover:text-blue-800 underline" target="_blank">${text}</a>`;
//       })
//       .replace(markdownPatterns.bold, (_, text) => `<strong class="font-semibold">${text}</strong>`)
//       .replace(markdownPatterns.italic, (_, text) => `<em class="italic">${text}</em>`);

//     return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: contentWithReplacements }} />;
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar - keep existing sidebar code */}
// <div
//         className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 transform ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } transition-all duration-300 md:translate-x-0 md:static`}
//       >
//         <div className="flex flex-col h-full">
//           <div className="p-4">
//             <button
//               onClick={createNewChat}
//               className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
//             >
//               <Plus size={20} />
//               New Chat
//             </button>
//           </div>
//           <div className="flex-1 overflow-y-auto">
//             {chats.map((chat) => (
//               <button
//                 key={chat._id}
//                 onClick={() => setCurrentChat(chat)}
//                 className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
//                   currentChat?._id === chat._id ? 'bg-gray-700' : 'text-gray-300'
//                 }`}
//               >
//                 {chat.title || 'New Chat'}
//               </button>
//             ))}
//           </div>
//           <div className="p-4 border-t border-gray-700">
//             <button
//               onClick={logout}
//               className="w-full flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
//             >
//               <LogOut size={20} />
//               Sign Out
//             </button>
//           </div>
//         </div>
//       </div>
//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Header - keep existing header code */}
// <header className="bg-white border-b border-gray-200 p-4">
//           <div className="flex items-center justify-between max-w-6xl mx-auto">
//             <button
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//               className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <Menu size={24} />
//             </button>
//             <h1 className="text-xl font-semibold text-gray-800">
//               {currentChat?.title || 'New Chat'}
//             </h1>
//           </div>
//         </header>
//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto px-4 py-6">
//           <div className="max-w-3xl mx-auto space-y-8"> {/* Increased space between messages */}
//             {currentChat?.messages?.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${
//                   msg.role === 'user' ? 'justify-end' : 'justify-start'
//                 } items-start gap-4`}
//               >
//                 <div
//                   className={`max-w-[85%] px-6 py-4 rounded-2xl ${
//                     msg.role === 'user'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-white shadow-sm border border-gray-200'
//                   }`}
//                 >
//                   {renderContent(msg.content)}
//                 </div>
//               </div>
//             ))}
//             {isLoading && (
//               <div className="flex justify-start items-start gap-4">
//                 <div className="max-w-[85%] px-6 py-4 rounded-2xl bg-white shadow-sm border border-gray-200">
//                   {renderLoadingState()}
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//         </div>
// <div className="border-t border-gray-200 bg-white p-4">
//           <form
//             onSubmit={sendMessage}
//             className="max-w-3xl mx-auto flex items-end gap-4"
//           >
//             <div className="flex-1 bg-white rounded-2xl border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
//               <textarea
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Send a message..."
//                 rows={1}
//                 className="w-full px-4 py-3 bg-transparent focus:outline-none resize-none"
//                 style={{
//                   minHeight: '44px',
//                   maxHeight: '200px'
//                 }}
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={isLoading || !message.trim()}
//               className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
//             >
//               <Send size={20} />
//             </button>
//           </form>
//         </div>
//         {/* Message Input - keep existing input code */}
//       </div>
//     </div>
//   );
// };

// export default Chat;


// import React, { useState, useEffect, useRef } from 'react';
// import { Send, Menu, Plus, LogOut } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
// import axios from 'axios';
// import {  PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';


// interface Message {
//   role: 'user' | 'system';
//   content: string;
// }

// interface Chat {
//   _id: string;
//   title: string;
//   messages: Message[];
// }

// const Chat: React.FC = () => {
//   const { token, logout } = useAuth();
//   const [message, setMessage] = useState<string>('');
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [currentChat, setCurrentChat] = useState<Chat | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
//   const [typingEffect, setTypingEffect] = useState<string>('');
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const [loadingMessage, setLoadingMessage] = useState<string>('');
//   const [status, setStatus] = useState<string>('Percepta is thinking...');

//   // Scroll handling
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
//         simulateTypingEffect(systemMessage.content);

//         setTimeout(() => {
//           setCurrentChat((prevChat) => {
//             if (!prevChat) return null;
//             return {
//               ...prevChat,
//               messages: [...prevChat.messages, systemMessage],
//             };
//           });
//           setTypingEffect('');
//         }, systemMessage.content.length * 50);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setIsLoading(false);
//       setLoadingMessage('');
//     }
//   };

//   const renderContent = (content: string) => {
//     const parts = content.split(/(\n\n|\n|```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\!\[.*?\]\(.*?\))/g);

//     return parts.map((part, index) => {
//       // Code blocks
//       if (part.startsWith('```') && part.endsWith('```')) {
//         const code = part.slice(3, -3);
//         const languageMatch = code.match(/^(\w+)\n/);
//         const language = languageMatch ? languageMatch[1] : 'text';
//         const cleanCode = languageMatch ? code.slice(language.length + 1) : code;

//         return (
//           <div key={index} className="rounded-lg my-4 overflow-hidden">
//             <SyntaxHighlighter
//               language={language}
//               style={darcula}
//               customStyle={{
//                 margin: 0,
//                 padding: '1rem',
//                 borderRadius: '0.5rem',
//               }}
//             >
//               {cleanCode.trim()}
//             </SyntaxHighlighter>
//           </div>
//         );
//       }

//       // Inline code
//       if (part.startsWith('`') && part.endsWith('`')) {
//         const code = part.slice(1, -1);
//         return (
//           <code key={index} className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded font-mono text-sm">
//             {code}
//           </code>
//         );
//       }

//       // Images
//       const imageMatch = part.match(/\[(.*?)\]\((.*?)\)/);
//       if (imageMatch) {
//         const altText = imageMatch[1];
//         const imageUrl = imageMatch[2];
//         return (
//           <img
//             key={index}
//             src={imageUrl}
//             alt={altText}
//             className="my-4 rounded-lg max-w-full border border-gray-300 shadow-md"
//           />
//         );
//       }

//       // Bold text
//       if (part.startsWith('**') && part.endsWith('**')) {
//         const text = part.slice(2, -2);
//         return <strong key={index} className="font-semibold">{text}</strong>;
//       }

//       // Italic text
//       if (part.startsWith('*') && part.endsWith('*')) {
//         const text = part.slice(1, -1);
//         return <em key={index} className="italic">{text}</em>;
//       }

//       // New lines
//       if (part === '\n\n') {
//         return <div key={index} className="h-4" />;
//       }

//       if (part === '\n') {
//         return <br key={index} />;
//       }

//       // Regular text
//       if (part.trim()) {
//         return <span key={index}>{part}</span>;
//       }

//       return null;
//     });
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 transform ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } transition-all duration-300 md:translate-x-0 md:static`}
//       >
//         <div className="flex flex-col h-full">
//           <div className="p-4">
//             <button
//               onClick={createNewChat}
//               className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
//             >
//               <Plus size={20} />
//               New Chat
//             </button>
//           </div>
//           <div className="flex-1 overflow-y-auto">
//             {chats.map((chat) => (
//               <button
//                 key={chat._id}
//                 onClick={() => setCurrentChat(chat)}
//                 className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
//                   currentChat?._id === chat._id ? 'bg-gray-700' : 'text-gray-300'
//                 }`}
//               >
//                 {chat.title || 'New Chat'}
//               </button>
//             ))}
//           </div>
//           <div className="p-4 border-t border-gray-700">
//             <button
//               onClick={logout}
//               className="w-full flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
//             >
//               <LogOut size={20} />
//               Sign Out
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         <header className="bg-white border-b border-gray-200 p-4">
//           <div className="flex items-center justify-between max-w-6xl mx-auto">
//             <button
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//               className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <Menu size={24} />
//             </button>
//             <h1 className="text-xl font-semibold text-gray-800">
//               {currentChat?.title || 'New Chat'}
//             </h1>
//           </div>
//         </header>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto px-4 py-6">
//           <div className="max-w-3xl mx-auto space-y-6">
//             {currentChat?.messages?.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${
//                   msg.role === 'user' ? 'justify-end' : 'justify-start'
//                 } items-start gap-4`}
//               >
//                 <div
//                   className={`max-w-[85%] px-6 py-4 rounded-2xl ${
//                     msg.role === 'user'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-white shadow-sm border border-gray-200'
//                   }`}
//                 >
//                   <div className="whitespace-pre-wrap break-words">
//                     {renderContent(msg.content)}
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="max-w-lg px-6 py-4 rounded-xl bg-white text-gray-800 shadow-md rounded-bl-none">
//                   <p className="whitespace-pre-wrap break-words animate-pulse">
//                     {loadingMessage}
//                   </p>
//                 </div>
//               </div>
//             )}
//             {typingEffect && (
//               <div className="flex justify-start items-start gap-4">
//                 <div className="max-w-[85%] px-6 py-4 rounded-2xl bg-white shadow-sm border border-gray-200">
//                   <div className="whitespace-pre-wrap break-words">
//                     {renderContent(typingEffect)}
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//         </div>

//         {/* Message Input */}
//         <div className="border-t border-gray-200 bg-white p-4">
//           <form
//             onSubmit={sendMessage}
//             className="max-w-3xl mx-auto flex items-end gap-4"
//           >
//             <div className="flex-1 bg-white rounded-2xl border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
//               <textarea
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Send a message..."
//                 rows={1}
//                 className="w-full px-4 py-3 bg-transparent focus:outline-none resize-none"
//                 style={{
//                   minHeight: '44px',
//                   maxHeight: '200px'
//                 }}
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={isLoading || !message.trim()}
//               className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
//             >
//               <Send size={20} />
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;





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

const LoadingDots = () => (
  <div className="flex items-center space-x-1">
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
  </div>
);

const Chat: React.FC = () => {
    const { token, logout } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [typingEffect, setTypingEffect] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [loadingState, setLoadingState] = useState<string>('thinking');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    let currentState = 0;
    const states = ['thinking', 'processing', 'framing'];

    const intervalId = setInterval(() => {
      setLoadingState(states[currentState]);
      currentState = (currentState + 1) % states.length;
    }, 2000);

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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
      return {
        ...prevChat,
        messages: [...prevChat.messages, newMessage],
      };
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.messages.length > 0) {
        const systemMessage = response.data.messages[response.data.messages.length - 1];

        // Start typing effect first
        simulateTypingEffect(systemMessage.content);

        // Wait for typing effect to complete before updating chat
        setTimeout(() => {
          setCurrentChat((prevChat) => {
            if (!prevChat) return null;
            return {
              ...prevChat,
              messages: [...prevChat.messages, systemMessage],
            };
          });
          setTypingEffect('');
        }, systemMessage.content.length * 50); // Match the typing effect delay
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      // setLoadingMessage('');
    }
  };
  // ... (keep existing fetchChats, createNewChat, and other utility functions)

  const renderLoadingState = () => {
    const getLoadingEmoji = () => {
      switch (loadingState) {
        case 'thinking': return '🤔';
        case 'processing': return '⚡';
        case 'framing': return '🎯';
        default: return '💭';
      }
    };

    return (
      <div className="flex items-center gap-2 text-gray-600 py-2">
        <span className="animate-pulse">{getLoadingEmoji()}</span>
        <span className="font-medium">Percepta is {loadingState}</span>
        <LoadingDots />
      </div>
    );
  };

  const renderContent = (content: string) => {
    // Split content by newlines first to preserve paragraph structure
    const paragraphs = content.split('\n').filter(p => p.trim());

    const processText = (text: string) => {
      const markdownPatterns = {
        bold: /\*\*(.*?)\*\*/g,
        italic: /\*(.*?)\*/g,
        link: /\[([^\]]+)\]\(([^)]+)\)/g,
        image: /!\[([^\]]*)\]\(([^)]+)\)/g,
        inlineCode: /`([^`]+)`/g,
        code: /```([a-z]*)\n([\s\S]*?)```/g,
      };

      // Process code blocks first
      if (text.match(markdownPatterns.code)) {
        return text.replace(markdownPatterns.code, (_, language, code) => {
          const languageClass = language ? `language-${language}` : '';
          return `
            <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto w-full">
              <code class="${languageClass} hljs">
                ${window.hljs ? window.hljs.highlight(code, { language: language || 'plaintext' }).value : code}
              </code>
            </pre>
          `;
        });
      }

      // Then process other markdown elements
      return text
        .replace(markdownPatterns.inlineCode, (_, code) =>
          `<code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded font-mono text-sm">${code}</code>`
        )
        .replace(markdownPatterns.image, (_, alt, src) =>
          `<div class="my-4"><img src="${src}" alt="${alt}" class="rounded-lg max-w-full h-auto" /></div>`
        )
        .replace(markdownPatterns.link, (_, text, url) =>
          `<a href="${url}" class="text-blue-600 hover:text-blue-800 underline" target="_blank">${text}</a>`
        )
        .replace(markdownPatterns.bold, (_, text) => `<strong class="font-semibold">${text}</strong>`)
        .replace(markdownPatterns.italic, (_, text) => `<em class="italic">${text}</em>`);
    };

    const processedParagraphs = paragraphs.map(p => {
      if (p.startsWith('```')) {
        return processText(p);
      }
      return `<p class="mb-4">${processText(p)}</p>`;
    });

    return (
      <div className="prose prose-sm max-w-none space-y-4">
        <div
          className="message-content space-y-4"
          dangerouslySetInnerHTML={{ __html: processedParagraphs.join('\n') }}
        />
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 md:translate-x-0 md:static`}
      >
        {/* ... keep existing sidebar code ... */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4">
          {/* ... keep existing header code ... */}
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {currentChat?.title || 'New Chat'}
            </h1>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {currentChat?.messages?.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                } items-start gap-4`}
              >
                <div
                  className={`max-w-[85%] px-6 py-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white shadow-sm border border-gray-200'
                  }`}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-start gap-4">
                <div className="max-w-[85%] px-6 py-4 rounded-2xl bg-white shadow-sm border border-gray-200">
                  {renderLoadingState()}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          <form
            onSubmit={sendMessage}
            className="max-w-3xl mx-auto flex items-end gap-4"
          >
            <div className="flex-1 bg-white rounded-2xl border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send a message..."
                rows={1}
                className="w-full px-4 py-3 bg-transparent focus:outline-none resize-none"
                style={{
                  minHeight: '44px',
                  maxHeight: '200px'
                }}
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

export default Chat;

