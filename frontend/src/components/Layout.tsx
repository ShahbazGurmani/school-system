import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '@/contexts/UserContext';

interface LayoutProps {
  children: ReactNode;
  role: 'student' | 'teacher' | 'principal';
  title: string;
  subtitle?: string;
}

const Layout = ({ children, role, title, subtitle }: LayoutProps) => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'teacher' && location.pathname === '/teacher' && user && user._id) {
      navigate(`/teacher/${user._id}`, { replace: true });
    }
  }, [role, location.pathname, user, navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <AppSidebar role={role} />
        <div className="flex-1 flex flex-col">
          <DashboardHeader role={role} title={title} subtitle={subtitle} />
          <main className="flex-1 p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
