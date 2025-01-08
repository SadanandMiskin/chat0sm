import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { ChatArea } from '../components/ChatArea';
import axios from 'axios';

export default function Chat() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get('/api/chat/list', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const handleNewChat = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/chat/create', {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setChats([response.data, ...chats]);
      setActiveChat(response.data);
    } catch (error) {
      console.error('Error creating chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!activeChat) return;

    try {
      setLoading(true);
      const response = await axios.post('/api/chat/message', {
        chatId: activeChat._id,
        message
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      // Update the active chat with new messages
      setActiveChat(response.data);

      // Update the chat in the chats list
      setChats(chats.map(chat =>
        chat._id === response.data._id ? response.data : chat
      ));
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onChatSelect={setActiveChat}
        onNewChat={handleNewChat}
      />
      <ChatArea
        chat={activeChat}
        loading={loading}
        onSendMessage={sendMessage}
      />
    </div>
  );
}
