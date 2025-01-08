import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Settings,
  LogOut,
  Menu,
  X,
  User,
  MessageSquare
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
// import { useToast } from '@/components/ui/use';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // const { toast } = useToast();

  const handleLogout = () => {
    logout();
    // toast({
    //   title: "Logged out successfully",
    //   duration: 2000
    // });
    navigate('/login');
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Header */}
      <header className="h-16 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>

          {/* Logo */}
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 text-purple-400" />
            <span className="ml-2 text-xl font-bold text-white">Gemini Chat</span>
          </div>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white">
                <User className="h-5 w-5 mr-2" />
                {user?.username}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-black/90 backdrop-blur-xl border-white/10 text-white">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="hover:bg-white/10 cursor-pointer"
                onClick={() => navigate('/settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-white/10 cursor-pointer text-red-400"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar */}
        <div
          className={`
            lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm
            ${sidebarOpen ? 'block' : 'hidden'}
          `}
          onClick={() => setSidebarOpen(false)}
        />

        <aside
          className={`
            lg:relative lg:block
            fixed inset-y-0 left-0 z-50 w-72 bg-black/30 backdrop-blur-xl
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
          `}
        >
          {/* Sidebar content */}
          {children}
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-hidden bg-black/10 backdrop-blur-sm">
          {children}
        </main>
      </div>
    </div>
  );
}