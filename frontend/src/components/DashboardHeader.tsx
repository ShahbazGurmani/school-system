import { Bell, User, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationCenter from "@/components/NotificationCenter";
import { useState, useContext } from "react";
import { UserContext } from "@/contexts/UserContext";

interface DashboardHeaderProps {
  role: 'student' | 'teacher' | 'principal';
  title: string;
  subtitle?: string;
}

const DashboardHeader = ({ role, title, subtitle }: DashboardHeaderProps) => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Math Assignment Due',
      message: 'Math Problem Set 5 is due tomorrow',
      type: 'assignment' as const,
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2', 
      title: 'Grade Posted',
      message: 'Your English Essay has been graded',
      type: 'grade' as const,
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      title: 'New Feedback',
      message: 'Teacher feedback on Science Lab Report',
      type: 'feedback' as const,
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const { user } = useContext(UserContext);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <header className="header-gradient border-b border-white/20 px-4 sm:px-6 lg:px-8 py-4 lg:py-6 shadow-lg relative">
      <div className="relative flex items-center justify-center w-full">
        {/* Hamburger placeholder for spacing on mobile */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center z-10">
          {/* Hamburger menu is rendered in AppSidebar, so just reserve space here if needed */}
          <span className="block w-10 h-10 lg:hidden" />
        </div>
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="flex items-center gap-2 lg:gap-3 mb-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient truncate text-center w-full">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium truncate text-center w-full">{subtitle}</p>
          )}
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3 lg:gap-6 ml-4">
          {/* Notifications */}
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteNotification={handleDeleteNotification}
          />

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 lg:gap-4 hover:bg-white/20 px-2 lg:px-4 py-2 lg:py-3 rounded-full h-auto">
                <Avatar className="h-8 w-8 lg:h-12 lg:w-12 ring-2 lg:ring-4 ring-purple-200">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm lg:text-lg">
                    {user ? user.name.split(' ').map(n => n[0]).join('') : '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <p className="text-sm lg:text-lg font-bold text-gray-900 truncate max-w-32 lg:max-w-none">{user ? user.name : 'Not logged in'}</p>
                  <p className="text-xs lg:text-sm text-purple-600 font-semibold">{role.charAt(0).toUpperCase() + role.slice(1)}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 lg:w-64 glass-effect bg-white/95 backdrop-blur-lg border border-white/20 shadow-xl">
              <DropdownMenuLabel className="text-base lg:text-lg font-bold">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-purple-50 py-2 lg:py-3 focus:bg-purple-50">
                <User className="mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5" />
                <span className="font-medium">View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-purple-100 py-2 lg:py-3 focus:bg-purple-100 flex items-center gap-2"
                onClick={() => {
                  if (role === 'principal') window.location.href = '/principal/settings';
                  // Add logic for other roles if needed
                }}
              >
                <SettingsIcon className="mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5" />
                <span className="font-medium">Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
