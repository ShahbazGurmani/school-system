import { useState, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  BookOpen, 
  User, 
  Bell, 
  LogOut,
  BarChart3,
  FileText,
  Users,
  Home,
  Layers,
  List,
  Menu
} from "lucide-react";
import { UserContext } from '@/contexts/UserContext';

interface AppSidebarProps {
  role: 'student' | 'teacher' | 'principal';
}

export function AppSidebar({ role }: AppSidebarProps) {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { user } = useContext(UserContext);

  const isCollapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path;

  const getNavClass = (path: string) => {
    const baseClass = "flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-xl transition-all duration-300 text-xs sm:text-sm font-semibold mb-1 lg:mb-2";
    if (isActive(path)) {
      return `${baseClass} bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30`;
    }
    return `${baseClass} text-white/80 hover:bg-white/15 hover:text-white hover:shadow-md active:bg-white/25 focus:bg-white/15 focus:text-white`;
  };

  const getMenuItems = () => {
    switch (role) {
      case 'student':
        return [
          { title: "Dashboard", url: "/student", icon: Home },
          { title: "Assignments", url: "/student/assignments", icon: FileText },
          { title: "Performance", url: "/student/performance", icon: BarChart3 },
          { title: "Teachers", url: "/student/teachers", icon: Users },
          { title: "Profile", url: "/student/profile", icon: User },
        ];
      case 'teacher':
        return [
          { title: "Dashboard", url: "/teacher", icon: Home },
          { title: "Classes", url: "/teacher/classes", icon: List },
          { title: "Students", url: "/teacher/students", icon: Users },
          { title: "Assignments", url: "/teacher/assignments", icon: FileText },
          { title: "Grades", url: "/teacher/grades", icon: BarChart3 },
          { title: "Reviews", url: "/teacher/review", icon: Bell },
           // Added Classes link
        ];
      default:
        return [];
    }
  };

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    window.location.href = '/';
  };

  const menuItems = getMenuItems();

  // Hamburger menu for mobile
  const Hamburger = () => (
    <button
      className="lg:hidden flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition hover:bg-white/10"
      aria-label="Open sidebar"
      onClick={() => setOpenMobile(true)}
      type="button"
    >
      <Menu className="h-7 w-7 text-purple-600 transition-transform duration-300" />
    </button>
  );

  return (
    <>
      {/* Hamburger only on mobile, outside sidebar for fixed top */}
      {isMobile && (
        <div className="fixed top-3 left-3 z-50">
          <Hamburger />
        </div>
      )}
      <Sidebar className="sidebar-gradient border-r border-white/20 shadow-2xl">
        <SidebarHeader className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 border-b border-white/20">
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl lg:rounded-2xl p-2 lg:p-3 shadow-lg">
              <BookOpen className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                  EduManage
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-white/80 font-semibold capitalize truncate">{role} Portal</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4 sm:px-6 py-6 lg:py-8">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs sm:text-sm font-bold text-white/90 uppercase tracking-wider mb-4 lg:mb-6">
              {!isCollapsed && "Navigation"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 lg:space-y-2">
                {role !== 'principal' && menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={getNavClass(item.url)}
                        onClick={() => { if (isMobile) setOpenMobile(false); }}
                      >
                        <item.icon className="h-4 w-4 lg:h-6 lg:w-6 flex-shrink-0" />
                        {!isCollapsed && <span className="text-xs sm:text-sm lg:text-base truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {role === 'principal' && (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to="/principal/dashboard" className={getNavClass("/principal/dashboard")}>
                          <Layers className="h-4 w-4 lg:h-6 lg:w-6 flex-shrink-0" />
                          {!isCollapsed && <span className="text-xs sm:text-sm lg:text-base truncate">Dashboard</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to="/principal/courses" className={getNavClass("/principal/courses")}>
                          <BookOpen className="h-4 w-4 lg:h-6 lg:w-6 flex-shrink-0" />
                          {!isCollapsed && <span className="text-xs sm:text-sm lg:text-base truncate">Courses</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to="/principal/classes" className={getNavClass("/principal/classes")}>
                          <List className="h-4 w-4 lg:h-6 lg:w-6 flex-shrink-0" />
                          {!isCollapsed && <span className="text-xs sm:text-sm lg:text-base truncate">Classes</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to="/principal/teachers" className={getNavClass("/principal/teachers")}>
                          <Users className="h-4 w-4 lg:h-6 lg:w-6 flex-shrink-0" />
                          {!isCollapsed && <span className="text-xs sm:text-sm lg:text-base truncate">Teachers</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to="/principal/students" className={getNavClass("/principal/students")}>
                          <Users className="h-4 w-4 lg:h-6 lg:w-6 flex-shrink-0" />
                          {!isCollapsed && <span className="text-xs sm:text-sm lg:text-base truncate">Students</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to="/principal/reports" className={getNavClass("/principal/reports")}>
                          <BookOpen className="h-4 w-4 lg:h-6 lg:w-6 flex-shrink-0" />
                          {!isCollapsed && <span className="text-xs sm:text-sm lg:text-base truncate">Reports</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to="/principal/settings" className={getNavClass("/principal/settings")}>
                          <BookOpen className="h-4 w-4 lg:h-6 lg:w-6 flex-shrink-0" />
                          {!isCollapsed && <span className="text-xs sm:text-sm lg:text-base truncate">Settings</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-4 sm:px-6 pb-4 lg:pb-6 border-t border-white/20 pt-4 lg:pt-6">
          <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-white/90 hover:bg-red-500/20 hover:text-white active:bg-red-500/30 focus:bg-red-500/20 focus:text-white px-3 lg:px-4 py-2 lg:py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <LogOut className="h-4 w-4 lg:h-6 lg:w-6 flex-shrink-0" />
                {!isCollapsed && <span className="ml-2 lg:ml-3 text-xs sm:text-sm lg:text-base">Logout</span>}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md glass-effect bg-white/95 backdrop-blur-lg border border-white/20 shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-lg lg:text-xl font-bold">Confirm Logout</DialogTitle>
                <DialogDescription className="text-sm lg:text-base">
                  Are you sure you want to logout? You'll need to sign in again to access your account.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-3">
                <Button variant="outline" onClick={() => setLogoutDialogOpen(false)} className="px-4 lg:px-6">
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleLogout} className="px-4 lg:px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
