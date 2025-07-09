import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, UserContext } from "@/contexts/UserContext";
import { useContext } from 'react';

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from './pages/LoginPage';
import PrincipalSettings from './pages/principal/PrincipalSettings';
import PrincipalCourses from './pages/principal/PrincipalCourses';
import PrincipalClasses from './pages/principal/PrincipalClasses';

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentPerformance from "./pages/student/StudentPerformance";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentTeachers from "./pages/student/StudentTeachers";
import StudentProfile from "./pages/student/StudentProfile";
import StudentRedirect from "./pages/student/StudentRedirect";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherAssignments from "./pages/teacher/TeacherAssignments";
import TeacherGrades from "./pages/teacher/TeacherGrades";
import TeacherAssignmentGrading from "./pages/teacher/TeacherAssignmentGrading";
import TeacherReview from "./pages/teacher/TeacherReview";
import TeacherClasses from './pages/teacher/TeacherClasses';
import TeacherClassDetail from './pages/teacher/TeacherClassDetail';

// Principal Pages
import PrincipalDashboard from "./pages/principal/PrincipalDashboard";
import PrincipalTeachers from "./pages/principal/PrincipalTeachers";
import PrincipalStudents from "./pages/principal/PrincipalStudents";
import PrincipalReports from "./pages/principal/PrincipalReports";

const queryClient = new QueryClient();

const TeacherLanding = () => {
  const { user } = useContext(UserContext);
  if (user && user.role === 'teacher') {
    window.location.href = `/teacher/${user._id}`;
    return null;
  }
  return <TeacherDashboard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Student Routes */}
            <Route path="/student" element={<StudentRedirect />} />
            <Route path="/student/:id" element={<StudentDashboard />} />
            <Route path="/student/performance" element={<StudentPerformance />} />
            <Route path="/student/assignments" element={<StudentAssignments />} />
            <Route path="/student/teachers" element={<StudentTeachers />} />
            <Route path="/student/profile" element={<StudentProfile />} />

            {/* Teacher Routes */}
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/:id" element={<TeacherDashboard />} />
            <Route path="/teacher/students" element={<TeacherStudents />} />
            <Route path="/teacher/assignments" element={<TeacherAssignments />} />
            <Route path="/teacher/assignments/grading" element={<TeacherAssignmentGrading />} />
            <Route path="/teacher/grades" element={<TeacherGrades />} />
            <Route path="/teacher/review" element={<TeacherReview />} />
            <Route path="/teacher/classes" element={<TeacherClasses />} />
            <Route path="/teacher/classes/class-detail" element={<TeacherClassDetail />} />

            {/* Principal Routes */}
            <Route path="/principal/:id" element={<PrincipalDashboard />} />
            <Route path="/principal/teachers" element={<PrincipalTeachers />} />
            <Route path="/principal/students" element={<PrincipalStudents />} />
            <Route path="/principal/reports" element={<PrincipalReports />} />
            <Route path="/principal/courses" element={<PrincipalCourses />} />
            <Route path="/principal/classes" element={<PrincipalClasses />} />
            <Route path="/principal/settings" element={<PrincipalSettings />} />

            {/* Login Routes */}
            <Route path="/login/:role" element={<LoginPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
