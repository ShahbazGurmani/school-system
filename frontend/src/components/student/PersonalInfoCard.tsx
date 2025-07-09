import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, GraduationCap, Users, Save } from "lucide-react";

interface PersonalInfoCardProps {
  isEditing: boolean;
  formData: {
    name: string;
    email: string;
    phone: string;
    class: string;
    section: string;
    rollNumber: string;
  };
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: string, value: string) => void;
}

const PersonalInfoCard = ({ isEditing, formData, onSave, onCancel, onChange }: PersonalInfoCardProps) => {
  return (
    <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <User className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg sm:text-xl">Personal Information</CardTitle>
        </div>
        <CardDescription className="text-sm">Your registration details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-gray-500" />
              Full Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              disabled={!isEditing}
              className="transition-all duration-300 hover:border-purple-300 focus:border-purple-500 text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rollNumber" className="flex items-center gap-2 text-sm font-medium">
              <Badge className="h-4 w-4 text-gray-500" />
              Roll Number
            </Label>
            <Input
              id="rollNumber"
              value={formData.rollNumber}
              disabled
              className="bg-gray-100 text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-gray-500" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              disabled={!isEditing}
              className="transition-all duration-300 hover:border-purple-300 focus:border-purple-500 text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4 text-gray-500" />
              Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              disabled={!isEditing}
              className="transition-all duration-300 hover:border-purple-300 focus:border-purple-500 text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="class" className="flex items-center gap-2 text-sm font-medium">
              <GraduationCap className="h-4 w-4 text-gray-500" />
              Class
            </Label>
            <Input
              id="class"
              value={formData.class}
              disabled
              className="bg-gray-100 text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="section" className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-gray-500" />
              Section
            </Label>
            <Input
              id="section"
              value={formData.section}
              disabled
              className="bg-gray-100 text-sm sm:text-base"
            />
          </div>
        </div>
        
        {isEditing && (
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="w-full sm:w-auto transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Cancel
            </Button>
            <Button 
              onClick={onSave}
              className="w-full sm:w-auto transition-all duration-300 hover:scale-105 active:scale-95 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
