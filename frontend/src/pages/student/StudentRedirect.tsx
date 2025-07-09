import { useUser } from "@/contexts/UserContext";
import { Navigate } from "react-router-dom";

const StudentRedirect = () => {
  const { user } = useUser();
  if (user && user.role === "student") {
    return <Navigate to={`/student/${user.id}`} replace />;
  }
  return <Navigate to="/login/student" replace />;
};

export default StudentRedirect; 