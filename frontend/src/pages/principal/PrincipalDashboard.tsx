import Layout from "@/components/Layout";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, BookOpen, TrendingUp, UserCheck, Activity } from "lucide-react";

const COLORS = ['#6366F1', '#10B981', '#F59E42', '#EF4444', '#8B5CF6'];

// Dummy data
const stats = [
  { label: 'Students', value: 1200, icon: Users, color: 'bg-blue-500' },
  { label: 'Teachers', value: 75, icon: UserCheck, color: 'bg-green-500' },
  { label: 'Courses', value: 32, icon: BookOpen, color: 'bg-purple-500' },
  { label: 'Attendance Rate', value: '96%', icon: TrendingUp, color: 'bg-yellow-500' },
];

const performanceData = [
  { month: 'Jan', performance: 85 },
  { month: 'Feb', performance: 88 },
  { month: 'Mar', performance: 90 },
  { month: 'Apr', performance: 92 },
  { month: 'May', performance: 91 },
  { month: 'Jun', performance: 93 },
  { month: 'Jul', performance: 95 },
  { month: 'Aug', performance: 94 },
  { month: 'Sep', performance: 96 },
  { month: 'Oct', performance: 97 },
  { month: 'Nov', performance: 98 },
  { month: 'Dec', performance: 99 },
];

const gradeDistribution = [
  { grade: 'A', count: 420 },
  { grade: 'B', count: 530 },
  { grade: 'C', count: 180 },
  { grade: 'D', count: 50 },
  { grade: 'F', count: 20 },
];

const attendanceData = [
  { name: 'Present', value: 96 },
  { name: 'Absent', value: 4 },
];

const recentActivity = [
  { id: 1, type: 'announcement', message: 'New school policy updated', time: '2 hours ago' },
  { id: 2, type: 'event', message: 'Annual Sports Day scheduled', time: '1 day ago' },
  { id: 3, type: 'grade', message: 'Grade reports published', time: '3 days ago' },
  { id: 4, type: 'attendance', message: 'Attendance for September finalized', time: '5 days ago' },
];

const PrincipalDashboard = () => {
  return (
    <Layout role="principal" title="Dashboard" subtitle="Welcome to your principal dashboard">
     
      <div className="p-4 md:p-8 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card key={stat.label} className="shadow-xl border-0 bg-gradient-to-br from-white via-gray-50 to-purple-50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.label}</CardTitle>
                <div className={`rounded-full p-2 ${stat.color} text-white`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Line Chart: School Performance */}
          <Card className="col-span-1 lg:col-span-2 shadow-xl border-0">
            <CardHeader>
              <CardTitle>School Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="performance" stroke="#6366F1" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart: Attendance */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bar Chart: Grade Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8B5CF6">
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-200">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="py-3 flex items-center gap-3">
                    <Activity className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-gray-800">{activity.message}</div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PrincipalDashboard;
