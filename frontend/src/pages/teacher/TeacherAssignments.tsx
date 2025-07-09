import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const TeacherAssignments = () => {
  return (
    <Layout role="teacher" title="Assignments" subtitle="Manage and create assignments for your students">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600 mt-2">Create and manage assignments for your students</p>
          </div>
          <Button className="gradient-bg">
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </div>
        <div className="grid gap-6">
          <div className="text-center text-gray-400 py-10">No assignments to display.</div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherAssignments;
