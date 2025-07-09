import Layout from '@/components/Layout';
import { useContext, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getAssignmentsByTeacher } from '@/api/teacherAssignments';
import { getStudentsByClassId } from '@/api/students';
import { getGradesByTeacher } from '@/api/grades';
import { UserContext } from '@/contexts/UserContext';
import { Select } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Assignment {
  _id: string;
  class: { _id: string; name: string };
  course: { _id: string; name: string };
}

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface Grade {
  _id: string;
  student: string;
  subject: string;
  teacher: string;
  class: string;
  assignmentMarks: number[];
  quizMarks: number[];
  paperMarks: number[];
  gradeLetter?: string;
}

interface StudentDetailWithUser {
  _id: string;
  user: { _id: string; name: string; email: string };
}

const gradeLetter = (score: number) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 50) return 'D';
  return 'F';
};

const TeacherGrades = () => {
  const { user } = useContext(UserContext);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<{ _id: string; name: string }[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [subjects, setSubjects] = useState<{ _id: string; name: string }[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [editRow, setEditRow] = useState<string | null>(null);
  const [editScores, setEditScores] = useState<{ assignment: string; quiz: string; paper: string }>({ assignment: '', quiz: '', paper: '' });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getAssignmentsByTeacher(user.id).then((data: Assignment[]) => {
      setAssignments(data);
      // Extract unique classes
      const classMap: Record<string, { _id: string; name: string }> = {};
      data.forEach(a => { if (a.class && !classMap[a.class._id]) classMap[a.class._id] = a.class; });
      const classIds = Object.keys(classMap);
      setClasses(Object.values(classMap));
      if (classIds.length > 0) {
        setSelectedClass(classIds[0]);
      } else {
        setSelectedClass('');
      }
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!selectedClass) return;
    // Get subjects for this class that the teacher teaches
    const filtered = assignments.filter(a => a.class._id === selectedClass);
    const subjMap: Record<string, { _id: string; name: string }> = {};
    filtered.forEach(a => { if (a.course && !subjMap[a.course._id]) subjMap[a.course._id] = a.course; });
    setSubjects(Object.values(subjMap));
    setSelectedSubject(Object.keys(subjMap)[0] || '');
    // Get students in this class
    getStudentsByClassId(selectedClass).then((data: StudentDetailWithUser[]) => {
      setStudents(data.map(s => ({ _id: s._id, name: s.user.name, email: s.user.email })));
    });
    // Get grades for this teacher
    if (user) {
      getGradesByTeacher(user.id).then((data: unknown) => {
        const gradesArr = Array.isArray(data) ? data as Grade[] : (data as { grades?: Grade[] }).grades || [];
        setGrades(gradesArr);
      });
    }
  }, [selectedClass, assignments, user]);

  // Helper to get a student's grade for a type
  const getGrade = (studentId: string, subjectId: string, type: 'assignment' | 'quiz' | 'paper') => {
    const g = grades.find(gr => gr.student === studentId && gr.subject === subjectId && gr.class === selectedClass);
    if (!g) return '';
    if (type === 'assignment') return g.assignmentMarks.length ? g.assignmentMarks[g.assignmentMarks.length - 1] : '';
    if (type === 'quiz') return g.quizMarks.length ? g.quizMarks[g.quizMarks.length - 1] : '';
    if (type === 'paper') return g.paperMarks.length ? g.paperMarks[g.paperMarks.length - 1] : '';
    return '';
  };

  // Helper to get grade _id for update
  const getGradeId = (studentId: string, subjectId: string, type: 'assignment' | 'quiz' | 'paper') => {
    const g = grades.find(gr => gr.student === studentId && gr.subject === subjectId && gr.class === selectedClass);
    return g ? g._id : null;
  };

  // Calculate performance and letter
  const calcPerformance = (assignment: number, quiz: number, paper: number) => {
    return assignment + quiz + paper;
  };

  // Handle edit
  const handleEdit = (studentId: string) => {
    const grade = grades.find(gr => gr.student === studentId && gr.subject === selectedSubject && gr.class === selectedClass);
    setEditRow(studentId);
    setEditScores({
      assignment: grade ? grade.assignmentMarks.join(',') : '',
      quiz: grade ? grade.quizMarks.join(',') : '',
      paper: grade ? grade.paperMarks.join(',') : '',
    });
  };

  // Handle save
  const handleSave = async (studentId: string) => {
    console.log('handleSave called for student:', studentId);
    setErrorMsg(null);
    if (!selectedClass) {
      setErrorMsg('No class selected. Cannot submit grades.');
      toast({ title: 'Error', description: 'No class selected. Cannot submit grades.', variant: 'destructive' });
      return;
    }
    // Parse input as arrays
    const assignmentMarks = editScores.assignment.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
    const quizMarks = editScores.quiz.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
    const paperMarks = editScores.paper.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
    // Validate
    if (
      assignmentMarks.some(n => n < 0 || n > 15) ||
      quizMarks.some(n => n < 0 || n > 15) ||
      paperMarks.some(n => n < 0 || n > 70)
    ) {
      setErrorMsg('Assignment/Quiz must be 0-15, Paper must be 0-70. No negative numbers allowed.');
      toast({ title: 'Error', description: 'Assignment/Quiz must be 0-15, Paper must be 0-70. No negative numbers allowed.', variant: 'destructive' });
      return;
    }
    // Find grade
    const grade = grades.find(gr => gr.student === studentId && gr.subject === selectedSubject && gr.class === selectedClass);
    const payload = {
      student: studentId,
      subject: selectedSubject,
      teacher: user.id,
      class: selectedClass,
      assignmentMarks,
      quizMarks,
      paperMarks,
    };
    console.log('Submitting grade payload:', payload);
    let res;
    try {
      if (grade) {
        res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/grades/${grade._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/grades`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (res.ok) {
        const saved = await res.json();
        // Fetch the latest grades from the backend for this teacher
        const latestGradesResponse = await getGradesByTeacher(user.id);
        const latestGrades = Array.isArray(latestGradesResponse)
          ? latestGradesResponse
          : latestGradesResponse.grades || [];
        setGrades(latestGrades);
        setEditRow(null);
        toast({ title: 'Success', description: 'Grades saved successfully.' });
      } else {
        // Log error details
        const errorText = await res.text();
        console.error('Failed to save grade:', res.status, errorText);
        setErrorMsg(`Failed to save grade: ${res.status} ${errorText}`);
        toast({ title: 'Error', description: `Failed to save grade: ${res.status} ${errorText}`, variant: 'destructive' });
      }
    } catch (err) {
      console.error('Exception during save:', err);
      setErrorMsg('An unexpected error occurred while saving.');
      toast({ title: 'Error', description: 'An unexpected error occurred while saving.', variant: 'destructive' });
    }
  };

  // Compute filtered and paginated students
  const filteredStudents = students.filter(student => {
    const grade = grades.find(gr => gr.student === student._id && gr.subject === selectedSubject && gr.class === selectedClass);
    const letter = grade ? gradeLetter(calcPerformance(
      grade.assignmentMarks.length ? grade.assignmentMarks[grade.assignmentMarks.length - 1] : 0,
      grade.quizMarks.length ? grade.quizMarks[grade.quizMarks.length - 1] : 0,
      grade.paperMarks.length ? grade.paperMarks[grade.paperMarks.length - 1] : 0,
    )) : '';
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) || student.email.toLowerCase().includes(search.toLowerCase());
    const matchesGrade = gradeFilter ? letter === gradeFilter : true;
    return matchesSearch && matchesGrade;
  });
  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Layout role="teacher" title="Grade Management" subtitle="View and manage student grades across all subjects">
      <div className="space-y-6">
        <div className="mb-4">
          <Tabs value={selectedClass} onValueChange={setSelectedClass} className="w-full">
            <TabsList>
              {classes.map(cls => (
                <TabsTrigger key={cls._id} value={cls._id}>{cls.name}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        {classes.length === 0 ? (
          <div className="text-center text-gray-500">No classes assigned to you.</div>
        ) : (
        <Tabs value={selectedSubject} onValueChange={setSelectedSubject} className="w-full">
          <TabsList className="mb-4">
            {subjects.map(subj => (
              <TabsTrigger key={subj._id} value={subj._id}>{subj.name}</TabsTrigger>
            ))}
          </TabsList>
          {subjects.map(subj => (
            <TabsContent key={subj._id} value={subj._id}>
        <Card>
          <CardHeader>
            <CardTitle>Student Grades</CardTitle>
          </CardHeader>
          <CardContent>
                  {loading ? <div>Loading...</div> : (
                    <div className="space-y-4">
                      {/* Filters above the table */}
                      <div className="flex flex-wrap gap-4 mb-4 items-center">
                        <input
                          type="text"
                          placeholder="Search by name or email"
                          value={search}
                          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                          className="border rounded p-2 w-56"
                        />
                        <select
                          value={gradeFilter}
                          onChange={e => { setGradeFilter(e.target.value); setCurrentPage(1); }}
                          className="border rounded p-2"
                        >
                          <option value="">All Grades</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="F">F</option>
                        </select>
                        <select
                          value={pageSize}
                          onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                          className="border rounded p-2"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                        <span>per page</span>
                      </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Student</th>
                              <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Subject</th>
                              <th className="text-left p-3">Assignment<br/><span className='text-xs text-gray-500'>(out of 15)</span></th>
                              <th className="text-left p-3">Quiz<br/><span className='text-xs text-gray-500'>(out of 15)</span></th>
                              <th className="text-left p-3">Paper<br/><span className='text-xs text-gray-500'>(out of 70)</span></th>
                              <th className="text-left p-3">Performance</th>
                    <th className="text-left p-3">Grade</th>
                              <th className="text-left p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                            {errorMsg && (
                              <tr><td colSpan={9} className="text-red-500 text-center py-2">{errorMsg}</td></tr>
                            )}
                            {paginatedStudents.map(student => {
                              const assignmentMarks = grades.find(gr => gr.student === student._id && gr.subject === selectedSubject && gr.class === selectedClass)?.assignmentMarks || [];
                              const quizMarks = grades.find(gr => gr.student === student._id && gr.subject === selectedSubject && gr.class === selectedClass)?.quizMarks || [];
                              const paperMarks = grades.find(gr => gr.student === student._id && gr.subject === selectedSubject && gr.class === selectedClass)?.paperMarks || [];
                              const grade = grades.find(gr => gr.student === student._id && gr.subject === selectedSubject && gr.class === selectedClass);
                              const hasAnyGrade = !!grade;
                              const isEditing = editRow === student._id;
                              const assignment = assignmentMarks.length ? assignmentMarks[assignmentMarks.length - 1] : undefined;
                              const quiz = quizMarks.length ? quizMarks[quizMarks.length - 1] : undefined;
                              const paper = paperMarks.length ? paperMarks[paperMarks.length - 1] : undefined;
                              const performance = typeof assignment === 'number' && typeof quiz === 'number' && typeof paper === 'number'
                                ? calcPerformance(assignment, quiz, paper)
                                : '';
                              const letter = typeof performance === 'number' ? gradeLetter(performance) : '';
                              return (
                                <tr key={student._id} className="border-b hover:bg-gray-50">
                                  <td className="p-3 font-medium">{student.name}</td>
                                  <td className="p-3">{student.email}</td>
                                  <td className="p-3">{subjects.find(s => s._id === selectedSubject)?.name ?? ''}</td>
                                  <td className="p-3">
                                    {isEditing ? (
                                      <input type="text" value={editScores.assignment} onChange={e => setEditScores(s => ({ ...s, assignment: e.target.value }))} className="border rounded p-1 w-24" placeholder="e.g. 10,12,14" />
                                    ) : assignmentMarks.length ? assignmentMarks.join(', ') : '-'}
                                  </td>
                      <td className="p-3">
                                    {isEditing ? (
                                      <input type="text" value={editScores.quiz} onChange={e => setEditScores(s => ({ ...s, quiz: e.target.value }))} className="border rounded p-1 w-24" placeholder="e.g. 10,12,14" />
                                    ) : quizMarks.length ? quizMarks.join(', ') : '-'}
                      </td>
                      <td className="p-3">
                                    {isEditing ? (
                                      <input type="text" value={editScores.paper} onChange={e => setEditScores(s => ({ ...s, paper: e.target.value }))} className="border rounded p-1 w-24" placeholder="e.g. 10,12,14" />
                                    ) : paperMarks.length ? paperMarks.join(', ') : '-'}
                                  </td>
                                  <td className="p-3">{typeof performance === 'number' ? performance : '-'}</td>
                                  <td className="p-3">
                                    {assignmentMarks.length && quizMarks.length && paperMarks.length && typeof letter === 'string' && letter !== '' ? (
                                      <Badge variant={letter === 'F' ? 'destructive' : 'default'}>{letter}</Badge>
                                    ) : '-'}
                      </td>
                      <td className="p-3">
                                    {isEditing ? (
                                      <>
                                        <button
                                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                          onClick={() => handleSave(student._id)}
                                        >
                                          {hasAnyGrade ? 'Update' : 'Save'}
                                        </button>
                                        <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => setEditRow(null)}>Cancel</button>
                                      </>
                                    ) : (
                                      <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleEdit(student._id)}
                                      >
                                        {hasAnyGrade ? 'Edit' : 'Add Marks'}
                                      </button>
                                    )}
                      </td>
                    </tr>
                              );
                            })}
                </tbody>
              </table>
            </div>
                      {/* Pagination controls below the table */}
                      <div className="flex justify-end items-center gap-2 mt-2">
                        <button
                          className="px-2 py-1 border rounded disabled:opacity-50"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >Prev</button>
                        <span>Page {currentPage} of {totalPages || 1}</span>
                        <button
                          className="px-2 py-1 border rounded disabled:opacity-50"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages || totalPages === 0}
                        >Next</button>
                      </div>
                    </div>
                  )}
          </CardContent>
        </Card>
            </TabsContent>
          ))}
        </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default TeacherGrades;
