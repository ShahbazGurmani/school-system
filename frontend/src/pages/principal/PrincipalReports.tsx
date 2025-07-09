import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, TrendingUp, Users } from "lucide-react";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const schoolStats = {
  averagePerformance: 85,
  totalStudents: 500,
  totalTeachers: 40,
  topPerformers: [{}, {}, {}, {}], // 4 top performers
  subjectPerformance: [
    { subject: 'Math', average: 88, totalStudents: 120 },
    { subject: 'Science', average: 82, totalStudents: 110 },
    { subject: 'English', average: 90, totalStudents: 130 },
    { subject: 'History', average: 80, totalStudents: 70 },
    { subject: 'Art', average: 75, totalStudents: 70 },
  ],
  teacherPerformance: [
    { id: 1, name: 'Mr. Smith', subject: 'Math', studentsCount: 30, averageGrades: 88 },
    { id: 2, name: 'Ms. Johnson', subject: 'Science', studentsCount: 28, averageGrades: 82 },
    { id: 3, name: 'Mr. Lee', subject: 'English', studentsCount: 32, averageGrades: 90 },
    { id: 4, name: 'Ms. Patel', subject: 'History', studentsCount: 20, averageGrades: 80 },
    { id: 5, name: 'Mr. Kim', subject: 'Art', studentsCount: 20, averageGrades: 75 },
  ],
};

const PrincipalReports = () => {
  return (
    <Layout role="principal" title="School Reports" subtitle="Comprehensive analytics and performance reports">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">School Reports</h1>
            <p className="text-gray-600 mt-2">Comprehensive analytics and performance reports</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button className="gradient-bg">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">School Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schoolStats.averagePerformance}%</div>
              <p className="text-xs text-muted-foreground">+5% from last term</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollment</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schoolStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Active students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teaching Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schoolStats.totalTeachers}</div>
              <p className="text-xs text-muted-foreground">Qualified teachers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schoolStats.topPerformers.length}</div>
              <p className="text-xs text-muted-foreground">Above 90% grade</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Subject Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance Analysis</CardTitle>
              <CardDescription>Average performance across all subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={schoolStats.subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="hsl(214 100% 50%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Subject Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Student Distribution by Subject</CardTitle>
              <CardDescription>Number of students enrolled in each subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={schoolStats.subjectPerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ subject, totalStudents }) => `${subject}: ${totalStudents}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="totalStudents"
                  >
                    {schoolStats.subjectPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Teacher Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Teacher Performance Summary</CardTitle>
            <CardDescription>Overview of teaching staff performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Teacher</th>
                    <th className="text-left p-3">Subject</th>
                    <th className="text-left p-3">Students</th>
                    <th className="text-left p-3">Avg Grades</th>
                    <th className="text-left p-3">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {schoolStats.teacherPerformance.map((teacher) => (
                    <tr key={teacher.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{teacher.name}</td>
                      <td className="p-3">{teacher.subject}</td>
                      <td className="p-3">{teacher.studentsCount}</td>
                      <td className="p-3">{teacher.averageGrades}%</td>
                      <td className="p-3">
                        <Badge variant={teacher.averageGrades >= 80 ? "default" : "secondary"}>
                          {teacher.averageGrades >= 80 ? "Excellent" : "Good"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PrincipalReports;
