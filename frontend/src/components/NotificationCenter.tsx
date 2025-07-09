
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, X } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'feedback' | 'general';
  read: boolean;
  createdAt: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'border-l-blue-500 bg-blue-50/50';
      case 'grade': return 'border-l-green-500 bg-green-50/50';
      case 'feedback': return 'border-l-yellow-500 bg-yellow-50/50';
      default: return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hover:bg-white/20 rounded-full h-10 w-10 lg:h-12 lg:w-12 p-0 transition-all duration-200 active:bg-white/30 focus:bg-white/20">
          <Bell className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 lg:h-6 lg:w-6 flex items-center justify-center p-0 text-xs lg:text-sm font-bold bg-gradient-to-r from-pink-500 to-purple-600 border-0 animate-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 sm:w-80 lg:w-96 p-0 bg-white/95 backdrop-blur-lg border border-white/20 shadow-xl" 
        align="end"
        sideOffset={8}
      >
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="pb-3 px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base lg:text-lg font-bold">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onMarkAllAsRead}
                  className="h-8 px-3 text-xs lg:text-sm hover:bg-purple-50 active:bg-purple-100 focus:bg-purple-50"
                >
                  <Check className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80 lg:h-96">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm lg:text-base">
                  No notifications
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`mx-2 lg:mx-4 p-3 lg:p-4 border-l-4 rounded-r-lg ${getNotificationColor(notification.type)} ${
                        !notification.read ? 'bg-blue-50/80' : 'bg-white/40'
                      } hover:bg-gray-50/80 active:bg-gray-100/60 cursor-pointer transition-colors duration-200`}
                      onClick={() => !notification.read && onMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm lg:text-base truncate">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-xs lg:text-sm text-gray-600 mb-2 line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-gray-400">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 active:bg-red-200 focus:bg-red-100 focus:text-red-600 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
