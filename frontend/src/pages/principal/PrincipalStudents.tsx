import Layout from "@/components/Layout";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, User, GraduationCap, Circle, Mail, Phone, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { getAllStudents, assignClassToStudent, createStudentWithDetails, updateStudent, deleteStudent } from '@/api/students';
import { getClasses } from '@/api/classes';

interface StudentDetailType {
  _id: string;
  user: { _id: string; name: string; email: string; phoneNumber: string; gender: string; };
  class?: string | { _id: string } | null;
}

interface ClassType { _id: string; name: string; }

const PrincipalStudents = () => {
  const [students, setStudents] = useState<StudentDetailType[]>([]);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [showDialog, setShowDialog] = useState(false);
  const [editStudent, setEditStudent] = useState<StudentDetailType | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '', gender: 'male', password: '', classId: '' });
  const [assignClassDialog, setAssignClassDialog] = useState<{ open: boolean; student: StudentDetailType | null }>({ open: false, student: null });
  const [selectedClassId, setSelectedClassId] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAllStudents().then(res => Array.isArray(res) ? res : res.users),
      getClasses(),
    ])
      .then(([studentData, classData]) => {
        setStudents(studentData);
        setClasses(classData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, []);

  // Filtering logic
  const filteredStudents = students.filter(s => {
    if (search && !(
      s.user.name.toLowerCase().includes(search.toLowerCase()) ||
      s.user.email.toLowerCase().includes(search.toLowerCase()) ||
      s.user.phoneNumber.includes(search)
    )) return false;
    if (filterGender && s.user.gender !== filterGender) return false;
    if (filterClass && s.class !== filterClass) return false;
    return true;
  });
  const paginatedStudents = filteredStudents.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(filteredStudents.length / limit) || 1;

  useEffect(() => { setPage(1); }, [filterClass, filterGender, search]);

  const openDialog = (student?: StudentDetailType) => {
    if (student) {
      setEditStudent(student);
      let classId = '';
      if (student.class && typeof student.class === 'object' && '_id' in student.class) {
        classId = student.class._id;
      } else if (typeof student.class === 'string') {
        classId = student.class;
      }
      setForm({
        name: student.user.name,
        email: student.user.email,
        phoneNumber: student.user.phoneNumber,
        gender: student.user.gender,
        password: '',
        classId,
      });
    } else {
      setEditStudent(null);
      setForm({ name: '', email: '', phoneNumber: '', gender: 'male', password: '', classId: '' });
    }
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editStudent) {
        // Only send fields required by backend
        const payload: Record<string, unknown> = {
          name: form.name,
          email: form.email,
          phoneNumber: form.phoneNumber,
          gender: form.gender,
          classId: form.classId,
        };
        if (form.password) payload.password = form.password;
        const updated = await updateStudent(editStudent._id, payload);
        // Refresh all students to ensure UI is in sync
        const studentData = await getAllStudents();
        setStudents(Array.isArray(studentData) ? studentData : studentData.users);
      } else {
        await createStudentWithDetails({
          name: form.name,
          email: form.email,
          phoneNumber: form.phoneNumber,
          gender: form.gender,
          password: form.password,
          classId: form.classId,
        });
        const studentData = await getAllStudents();
        setStudents(Array.isArray(studentData) ? studentData : studentData.users);
      }
      setShowDialog(false);
      setEditStudent(null);
    } catch {
      setError('Failed to save student');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await deleteStudent(id);
      const studentData = await getAllStudents();
      setStudents(Array.isArray(studentData) ? studentData : studentData.users);
    } catch {
      setError('Failed to delete student');
    }
  };

  return (
    <Layout role="principal" title="Students" subtitle="View and manage students">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <h1 className="text-2xl font-bold">Students</h1>
          <Button onClick={() => openDialog()} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-md">
            + Add Student
          </Button>
        </div>
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
            <select value={filterGender} onChange={e => { setFilterGender(e.target.value); setPage(1); }} className="rounded border p-2 text-sm">
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
      {error && <div className="text-red-500 mb-4 text-center font-semibold">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedStudents.map(student => {
              let studentClass: ClassType | undefined;
              if (student.class && typeof student.class === 'object' && student.class !== null && '_id' in student.class) {
                const classObj = student.class as { _id: string };
                studentClass = classes.find(cls => cls._id === classObj._id);
              } else if (typeof student.class === 'string') {
                studentClass = classes.find(cls => cls._id === student.class);
              }
              // Gender icon logic
              let genderIcon = <User className="h-4 w-4 text-blue-400" />;
              if (student.user.gender?.toLowerCase() === 'female') genderIcon = <span className="h-4 w-4 text-pink-400 font-bold" style={{fontSize: '1.1rem', lineHeight: 1}}>&#9792;</span>;
              else if (student.user.gender?.toLowerCase() === 'other') genderIcon = <Circle className="h-4 w-4 text-gray-400" />;
              return (
                <div key={student._id} className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-6 flex flex-col items-start border border-gray-100">
                  <div className="flex items-center gap-3 mb-2 w-full">
                    <div className="flex-shrink-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full h-12 w-12 flex items-center justify-center">
                      <User className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {student.user.name}
                        {studentClass && (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold ml-2">
                            <GraduationCap className="h-4 w-4" />
                            {studentClass.name}
                          </span>
                        )}
                        {!student.class && (
                          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-semibold ml-2 animate-pulse" title="Pending class assignment">
                            <Clock className="h-4 w-4" /> Pending
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="h-4 w-4 text-blue-400" />
                        {student.user.email}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="h-4 w-4 text-green-400" />
                        {student.user.phoneNumber}
                      </div>
                      <div className="text-xs text-gray-500 capitalize flex items-center gap-1">
                        {genderIcon}
                        {student.user.gender}
                      </div>
                    </div>
                  </div>
                  {!student.class && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => setAssignClassDialog({ open: true, student })}
                      className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white font-bold shadow-lg mb-2 hover:scale-105 transition-transform border-2 border-yellow-300"
                      title="Assign a class to this student"
                    >
                      Assign Class
                    </Button>
                  )}
                  {!student.class && student._id === student.user._id && (
                    <div className="text-xs text-red-500 font-semibold mt-2">
                      Student profile incomplete. Contact admin.
                    </div>
                  )}
                  <div className="flex gap-2 mt-4 w-full">
                    <Button size="sm" variant="outline" onClick={() => openDialog(student)} className="flex-1">
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(student._id)} className="flex-1">
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
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
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editStudent ? 'Edit Student' : 'Add Student'}</DialogTitle>
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
            <Input placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required={!editStudent} />
            <select value={form.classId} onChange={e => setForm(f => ({ ...f, classId: e.target.value }))} className="w-full rounded-lg border p-2" required>
              <option value="" disabled>Select Class</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>{cls.name}</option>
              ))}
            </select>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <DialogFooter>
              <Button type="submit" className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-md">{editStudent ? 'Update' : 'Add'} Student</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={assignClassDialog.open} onOpenChange={open => setAssignClassDialog({ open, student: assignClassDialog.student })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Class</DialogTitle>
          </DialogHeader>
          <form onSubmit={async e => {
            e.preventDefault();
            setError('');
            try {
              if (assignClassDialog.student && selectedClassId) {
                await assignClassToStudent(assignClassDialog.student.user._id, selectedClassId);
                // Refresh students
                const studentData = await getAllStudents();
                setStudents(Array.isArray(studentData) ? studentData : studentData.users);
              }
            } catch (err) {
              setError('Failed to assign class. Please try again.');
            }
            setAssignClassDialog({ open: false, student: null });
            setSelectedClassId('');
          }} className="space-y-4">
            <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="w-full rounded-lg border p-2" required>
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
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PrincipalStudents;
