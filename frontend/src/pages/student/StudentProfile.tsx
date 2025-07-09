import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import Layout from "@/components/Layout";

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user, setUser } = useUser();

  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students/${id}`)
        .then(res => res.json())
        .then(data => {
          setUser({
            id: data._id,
            name: data.name,
            email: data.email,
            role: "student"
          });
        });
    }
  }, [id, setUser]);

  return (
    <Layout role="student" title="Profile" subtitle="View and edit your profile information">
      <div className="text-center text-gray-400 py-10">
        {user ? (
          <>
            <div>Name: {user.name}</div>
            <div>Email: {user.email}</div>
            <div>Role: {user.role}</div>
          </>
        ) : (
          "No profile data to display."
        )}
      </div>
    </Layout>
  );
};

export default StudentProfile;
