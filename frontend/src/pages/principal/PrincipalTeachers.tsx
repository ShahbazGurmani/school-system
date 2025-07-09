import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@/contexts/UserContext";
import { Pencil, Trash2, Plus, User, BookOpen, Users, Atom } from "lucide-react";
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from "@/api/teachers";
import { getClasses } from "@/api/classes";
import { getCourses } from "@/api/courses";
import { getAssignmentsByTeacher, createTeacherAssignment, deleteTeacherAssignment, getTeacherAssignments } from "@/api/teacherAssignments";

interface Course { _id: string; name: string; code: string; }
interface SchoolClass { _id: string; name: string; }
interface Teacher { _id: string; name: string; email: string; phoneNumber: string; gender: string; }
interface Assignment { _id: string; course: Course; class: SchoolClass; teacher: Teacher; }

const PrincipalTeachers = () => {
  const { user } = useUser();
  const isAdmin = user?.role === "principal";
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phoneNumber: "", gender: "male", password: "" });
  const [assignDialog, setAssignDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignForm, setAssignForm] = useState({ course: "", class: "" });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // 6 per page for grid
  const [total, setTotal] = useState(0);
  const [allAssignments, setAllAssignments] = useState<Assignment[]>([]);
  const [filterClass, setFilterClass] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);

  // Add a color palette for chips
  const chipColors = [
    'bg-purple-100 text-purple-800',
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-pink-100 text-pink-800',
    'bg-yellow-100 text-yellow-800',
    'bg-orange-100 text-orange-800',
    'bg-teal-100 text-teal-800',
  ];

  // Fetch all data ONCE on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getTeachers({}),
      getClasses(),
      getCourses(),
      getTeacherAssignments(),
    ])
      .then(([teacherData, classData, courseData, assignmentData]) => {
        setAllTeachers(Array.isArray(teacherData.users) ? teacherData.users : []);
        setClasses(classData);
        setCourses(courseData);
        setAllAssignments(assignmentData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  // Open dialog for add/edit
  const openDialog = (teacher?: Teacher) => {
    if (teacher) {
      setEditTeacher(teacher);
      setForm({
        name: teacher.name,
        email: teacher.email,
        phoneNumber: teacher.phoneNumber,
        gender: teacher.gender,
        password: "",
      });
    } else {
      setEditTeacher(null);
      setForm({ name: "", email: "", phoneNumber: "", gender: "male", password: "" });
    }
    setShowDialog(true);
  };

  // Handle add/edit submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editTeacher) {
        await updateTeacher(editTeacher._id, form);
      } else {
        await createTeacher(form);
      }
      setShowDialog(false);
      setEditTeacher(null);
      setTeachers(await getTeachers());
    } catch {
      setError("Failed to save teacher");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await deleteTeacher(id);
      setTeachers(teachers.filter(t => t._id !== id));
    } catch {
      setError("Failed to delete teacher");
    }
  };

  // Assignment logic
  const openAssignDialog = async (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setAssignDialog(true);
    setAssignForm({ course: "", class: "" });
    setAssignments(await getAssignmentsByTeacher(teacher._id));
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    try {
      await createTeacherAssignment({ teacher: selectedTeacher._id, course: assignForm.course, class: assignForm.class });
      setAssignments(await getAssignmentsByTeacher(selectedTeacher._id));
      setAssignForm({ course: "", class: "" });
    } catch {
      setError("Failed to assign course/class");
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!window.confirm("Remove this assignment?")) return;
    try {
      await deleteTeacherAssignment(id);
      if (selectedTeacher) setAssignments(await getAssignmentsByTeacher(selectedTeacher._id));
    } catch {
      setError("Failed to remove assignment");
    }
  };

  // Filtering and searching logic on frontend
  const filteredTeachers = allTeachers.filter(teacher => {
    if (search && !(
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.email.toLowerCase().includes(search.toLowerCase()) ||
      teacher.phoneNumber.includes(search)
    )) return false;
    if (filterGender && teacher.gender !== filterGender) return false;
    if (filterClass || filterCourse) {
      const teacherAssignments = allAssignments.filter(a => a.teacher._id === teacher._id);
      if (filterClass && !teacherAssignments.some(a => a.class._id === filterClass)) return false;
      if (filterCourse && !teacherAssignments.some(a => a.course._id === filterCourse)) return false;
    }
    return true;
  });
  const paginatedTeachers = filteredTeachers.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(filteredTeachers.length / limit) || 1;

  // Reset page to 1 when filters or debounced search change
  useEffect(() => { setPage(1); }, [filterClass, filterCourse, filterGender, search]);

  // Helper to deduplicate assignments by course+class
  function getUniqueAssignments(assignments: Assignment[]) {
    const map = new Map<string, Assignment>();
    for (const a of assignments) {
      map.set(`${a.course._id}-${a.class._id}`, a);
    }
    return Array.from(map.values());
  }

  const handleAssignDialogClose = (open: boolean) => {
    setAssignDialog(open);
    if (!open && selectedTeacher) {
      // Refresh all assignments after closing dialog
      getTeacherAssignments().then(setAllAssignments);
    }
  };

  return (
    <Layout role="principal" title="Teachers" subtitle="Manage teachers, assignments, and profiles">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Search by name, email, or phone"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="max-w-xs"
            />
            <select value={filterClass} onChange={e => { setFilterClass(e.target.value); setPage(1); }} className="rounded border p-2 text-sm">
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>{cls.name}</option>
              ))}
            </select>
            <select value={filterCourse} onChange={e => { setFilterCourse(e.target.value); setPage(1); }} className="rounded border p-2 text-sm">
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>{course.name}</option>
              ))}
            </select>
            <select value={filterGender} onChange={e => { setFilterGender(e.target.value); setPage(1); }} className="rounded border p-2 text-sm">
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          {isAdmin && (
            <Button onClick={() => openDialog()} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-md">
              <Plus className="h-4 w-4" /> Add Teacher
            </Button>
          )}
        </div>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTeachers.map(teacher => {
              const teacherAssignments = getUniqueAssignments(allAssignments.filter(a => a.teacher._id === teacher._id));
              return (
                <Card key={teacher._id} className="shadow-xl border-0 bg-white/95 hover:scale-[1.02] transition-transform">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <User className="h-6 w-6 text-green-500" /> {teacher.name}
                    </CardTitle>
                    <div className="text-xs text-gray-500">{teacher.email}</div>
                    <div className="text-xs text-gray-500">{teacher.phoneNumber}</div>
                    <div className="text-xs text-gray-500 capitalize">{teacher.gender}</div>
                    {/* Show assignments as chips */}
                    <div className="mt-2">
                      <div className="font-semibold text-sm mb-1">Assignments:</div>
                      {teacherAssignments.length === 0 ? (
                        <div className="text-xs text-gray-400">No assignments</div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {teacherAssignments.map((a, idx) => (
                            <span
                              key={a._id}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shadow-sm ${chipColors[idx % chipColors.length]}`}
                              aria-label={`Course: ${a.course.name}, Class: ${a.class.name}`}
                            >
                              <BookOpen className="h-3 w-3" />
                              <span>{a.course.name}</span>
                              <span className="text-gray-400">/</span>
                              <span>{a.class.name}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2 mt-2">
                    {isAdmin && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => openDialog(teacher)}>
                          <Pencil className="h-4 w-4" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(teacher._id)}>
                          <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                        <Button size="sm" variant="default" onClick={() => openAssignDialog(teacher)}>
                          <BookOpen className="h-4 w-4" /> Assign Courses/Classes
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 gap-2">
            <span className="px-2 py-1 text-sm">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</Button>
          </div>
        </>
      )}
      {/* Add/Edit Teacher Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTeacher ? "Edit Teacher" : "Add Teacher"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <Input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            <Input placeholder="Phone Number" value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))} required />
            <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} className="w-full rounded-lg border p-2">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <Input placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required={!editTeacher} />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <DialogFooter>
              <Button type="submit" className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-md">{editTeacher ? "Update" : "Add"} Teacher</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Assign Courses/Classes Dialog */}
      <Dialog open={assignDialog} onOpenChange={handleAssignDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Courses/Classes</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssign} className="space-y-4">
            <select value={assignForm.course} onChange={e => setAssignForm(f => ({ ...f, course: e.target.value }))} className="w-full rounded-lg border p-2" required>
              <option value="" disabled>Select Course</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>{course.name}</option>
              ))}
            </select>
            <select value={assignForm.class} onChange={e => setAssignForm(f => ({ ...f, class: e.target.value }))} className="w-full rounded-lg border p-2" required>
              <option value="" disabled>Select Class</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>{cls.name}</option>
              ))}
            </select>
            <DialogFooter>
              <Button type="submit" className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-md">Assign</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
          <div className="mt-6">
            <h3 className="font-bold mb-2">Current Assignments</h3>
            {assignments.length === 0 ? (
              <div className="text-gray-400 text-sm">No assignments</div>
            ) : (
              <ul className="space-y-2">
                {assignments.map(a => (
                  <li key={a._id} className="flex items-center gap-2 text-sm bg-gray-50 rounded px-3 py-2">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold">{a.course.name}</span>
                    <span className="text-gray-500">in</span>
                    <span className="font-semibold">{a.class.name}</span>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteAssignment(a._id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PrincipalTeachers;
