import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, TrendingUp, UserCheck } from "lucide-react";
import { StudentProfile } from '@/contexts/StudentContext';

interface AcademicInfoCardProps {
  student: StudentProfile;
}

const AcademicInfoCard = ({ student }: AcademicInfoCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-green-600" />
          <CardTitle className="text-lg sm:text-xl">Academic Information</CardTitle>
        </div>
        <CardDescription className="text-sm">Your current academic status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4 sm:p-6 border rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 hover:shadow-md transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-sm sm:text-lg text-gray-800 mb-1">Overall Performance</h3>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">{student.performance?.overall ?? '--'}%</p>
          </div>
          <div className="text-center p-4 sm:p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-md transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-sm sm:text-lg text-gray-800 mb-1">Total Subjects</h3>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">{student.performance?.subjects?.length ?? '--'}</p>
          </div>
          <div className="text-center p-4 sm:p-6 border rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-md transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-center mb-2">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-sm sm:text-lg text-gray-800 mb-1">Teachers</h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{student.teachers?.length ?? '--'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcademicInfoCard;
