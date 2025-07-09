import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User, GraduationCap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { StudentProfile } from '@/contexts/StudentContext';

interface ProfilePictureCardProps {
  student: StudentProfile;
}

const ProfilePictureCard = ({ student }: ProfilePictureCardProps) => {
  return (
    <Card className="lg:col-span-1 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Camera className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-lg sm:text-xl">Profile Picture</CardTitle>
        </div>
        <CardDescription className="text-sm">Upload your profile photo</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-purple-200 transition-all duration-300 group-hover:ring-purple-300">
            <AvatarImage src={student.avatar} className="object-cover" />
            <AvatarFallback className="text-lg sm:text-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              {student.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center space-y-1">
          <p className="font-semibold text-base sm:text-lg text-gray-800">{student.name}</p>
          <p className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1">
            <User className="h-3 w-3" />
            Roll: {student.rollNumber ?? '--'}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1">
            <GraduationCap className="h-3 w-3" />
            Class {student.className ?? '--'}-{student.section ?? '--'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePictureCard;
