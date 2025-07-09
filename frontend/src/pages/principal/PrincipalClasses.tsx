import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Pencil, Trash2, Plus, BookOpen, FlaskConical, Calculator, Globe, Atom, BookText } from "lucide-react";
import { getClasses, createClass, updateClass, deleteClass } from "@/api/classes";
import { getCourses } from "@/api/courses";

interface Course {
  _id: string;
  name: string;
  code: string;
}

interface SchoolClass {
  _id: string;
  name: string;
  courses: Course[];
}

// Map course names to icons/colors for demo
const courseIcons: Record<string, any> = {
  Biology: FlaskConical,
  Physics: Atom,
  Math: Calculator,
  Geography: Globe,
  English: BookText,
  Chemistry: FlaskConical,
  History: BookOpen,
  Default: BookOpen,
};
const courseColors: string[] = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-indigo-500',
  'bg-orange-500',
];

const PrincipalClasses = () => {
  const { user } = useUser();
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editClass, setEditClass] = useState<SchoolClass | null>(null);
  const [form, setForm] = useState({ name: "", courses: [] as string[] });
  const isAdmin = user?.role === "principal";

  // Fetch classes and courses
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getClasses(),
      getCourses(),
    ])
      .then(([classData, courseData]) => {
        setClasses(classData);
        setCourses(courseData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  // Open dialog for add/edit
  const openDialog = (schoolClass?: SchoolClass) => {
    if (schoolClass) {
      setEditClass(schoolClass);
      setForm({
        name: schoolClass.name,
        courses: schoolClass.courses.map(c => c._id),
      });
    } else {
      setEditClass(null);
      setForm({ name: "", courses: [] });
    }
    setShowDialog(true);
  };

  // Handle add/edit submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editClass) {
        await updateClass(editClass._id, form);
      } else {
        await createClass(form);
      }
      setShowDialog(false);
      setForm({ name: "", courses: [] });
      setEditClass(null);
      setClasses(await getClasses());
    } catch {
      setError("Failed to save class");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      await deleteClass(id);
      setClasses(classes.filter(c => c._id !== id));
    } catch {
      setError("Failed to delete class");
    }
  };

  // Handle course selection
  const handleCourseSelect = (courseId: string) => {
    setForm(f => ({
      ...f,
      courses: f.courses.includes(courseId)
        ? f.courses.filter(id => id !== courseId)
        : [...f.courses, courseId],
    }));
  };

  return (
    <Layout role="principal" title="Classes" subtitle="Manage classes and assign courses">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Classes</h1>
        {isAdmin && (
          <Button onClick={() => openDialog()} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-md">
            <Plus className="h-4 w-4" /> Add Class
          </Button>
        )}
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map(schoolClass => (
            <Card key={schoolClass._id} className="shadow-xl border-0 bg-white/95 hover:scale-[1.02] transition-transform">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 text-white font-bold mr-2">
                    {schoolClass.name}
                  </span>
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {schoolClass.courses.length === 0 ? (
                    <span className="text-xs text-gray-400">No courses assigned</span>
                  ) : (
                    schoolClass.courses.map((c, idx) => {
                      const Icon = courseIcons[c.name] || courseIcons.Default;
                      return (
                        <span key={c._id} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-white ${courseColors[idx % courseColors.length]}`}>
                          <Icon className="h-4 w-4" /> {c.name}
                        </span>
                      );
                    })
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex gap-2 mt-2">
                {isAdmin && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => openDialog(schoolClass)}>
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(schoolClass._id)}>
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
            <DialogTitle>{editClass ? "Edit Class" : "Add Class"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Class Name (e.g., 10th Grade)"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <div>
              <div className="font-medium mb-2">Select Courses</div>
              <div className="flex flex-wrap gap-2">
                {courses.map((course, idx) => {
                  const Icon = courseIcons[course.name] || courseIcons.Default;
                  return (
                    <Button
                      key={course._id}
                      type="button"
                      variant={form.courses.includes(course._id) ? "default" : "outline"}
                      onClick={() => handleCourseSelect(course._id)}
                      className={`text-xs flex items-center gap-1 ${form.courses.includes(course._id) ? courseColors[idx % courseColors.length] : ''}`}
                    >
                      <Icon className="h-4 w-4" /> {course.name}
                    </Button>
                  );
                })}
              </div>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <DialogFooter>
              <Button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-md">{editClass ? "Update" : "Add"} Class</Button>
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

export default PrincipalClasses; 