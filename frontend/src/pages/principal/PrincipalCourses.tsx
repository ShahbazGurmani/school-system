import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Course {
  _id: string;
  name: string;
  code: string;
}

const PrincipalCourses = () => {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [form, setForm] = useState({ name: "", code: "" });
  const isAdmin = user?.role === "principal";

  // Fetch courses
  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subjects`)
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load courses");
        setLoading(false);
      });
  }, []);

  // Open dialog for add/edit
  const openDialog = (course?: Course) => {
    if (course) {
      setEditCourse(course);
      setForm({ name: course.name, code: course.code });
    } else {
      setEditCourse(null);
      setForm({ name: "", code: "" });
    }
    setShowDialog(true);
  };

  // Handle add/edit submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const method = editCourse ? "PUT" : "POST";
    const url = editCourse
      ? `${import.meta.env.VITE_BACKEND_URL}/api/subjects/${editCourse._id}`
      : `${import.meta.env.VITE_BACKEND_URL}/api/subjects`;
    const res = await fetch(url + `?role=principal`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError("Failed to save course");
      return;
    }
    setShowDialog(false);
    setForm({ name: "", code: "" });
    setEditCourse(null);
    // Refresh list
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subjects`)
      .then(res => res.json())
      .then(data => setCourses(data));
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subjects/${id}?role=principal`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setError("Failed to delete course");
      return;
    }
    setCourses(courses.filter(c => c._id !== id));
  };

  return (
    <Layout role="principal" title="Courses" subtitle="Manage courses">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        {isAdmin && (
          <Button onClick={() => openDialog()} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Course
          </Button>
        )}
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Card key={course._id} className="shadow border-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold">{course.name}</CardTitle>
                <div className="text-xs text-gray-500">Code: {course.code}</div>
              </CardHeader>
              <CardContent className="flex gap-2 mt-2">
                {isAdmin && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => openDialog(course)}>
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(course._id)}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editCourse ? "Edit Course" : "Add Course"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Course Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              placeholder="Course Code"
              value={form.code}
              onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <DialogFooter>
              <Button type="submit">{editCourse ? "Update" : "Add"} Course</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PrincipalCourses; 