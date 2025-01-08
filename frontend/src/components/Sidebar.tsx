import { Button } from "@/components/ui/button"
import { PlusCircle, MessageSquare } from 'lucide-react'

// Define the types for the props
interface SidebarProps {
  chats: { _id: string; title: string }[]; // Define chats as an array of objects with _id and title
  activeChat: { _id: string } | null;
  onChatSelect: (chat) => void;
  onNewChat: () => void;
}

export function Sidebar({ chats, activeChat, onChatSelect, onNewChat }: SidebarProps) {
  if (!Array.isArray(chats)) {
    console.error("Chats prop is not an array:", chats);
    return null; // Return null or a fallback UI if chats is not an array
  }

  return (
    <div className="w-72 bg-black/30 backdrop-blur-xl p-6 border-r border-white/10">
      <Button
        onClick={onNewChat}
        className="w-full mb-6 bg-white/10 hover:bg-white/20 text-white"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> New Chat
      </Button>

      <div className="space-y-2">
        {chats.map((chat) => (
          <Button
            key={chat._id}
            variant="ghost"
            className={`w-full justify-start text-white/70 hover:text-white hover:bg-white/10 ${
              activeChat?._id === chat._id ? 'bg-white/20' : ''
            }`}
            onClick={() => onChatSelect(chat)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {chat.title || 'New Chat'}
          </Button>
        ))}
      </div>
    </div>
  );
}
