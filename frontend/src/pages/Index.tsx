import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, BookOpen } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Student Portal",
      description: "Access your grades, assignments, and track your academic progress",
      icon: GraduationCap,
      color: "bg-blue-500",
      loginPath: "/login/student"
    },
    {
      title: "Teacher Dashboard",
      description: "Manage classes, assignments, grades, and student performance",
      icon: Users,
      color: "bg-green-500",
      loginPath: "/login/teacher"
    },
    {
      title: "Principal Overview",
      description: "Monitor school performance, teachers, and overall administration",
      icon: BookOpen,
      color: "bg-purple-500",
      loginPath: "/login/principal"
    }
  ];

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            EduManage Pro
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Complete School Management System for Students, Teachers, and Administrators
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, index) => {
            const IconComponent = role.icon;
            return (
              <Card 
                key={index} 
                className="hover-lift cursor-pointer border-0 bg-white/95 backdrop-blur-sm"
                onClick={() => navigate(role.loginPath)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`${role.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">{role.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    className="w-full"
                    onClick={e => {
                      e.stopPropagation();
                      navigate(role.loginPath);
                    }}
                  >
                    Access Portal
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-white/70">
            © 2025 EduManage Pro. Empowering Education Through Technology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
