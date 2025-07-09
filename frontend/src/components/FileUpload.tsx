
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileUpload, 
  acceptedTypes = ".pdf,.doc,.docx,.txt", 
  maxSize = 10 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    onFileUpload(file);
    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded successfully`,
    });
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="w-full">
      {!uploadedFile ? (
        <Card 
          className={`border-2 border-dashed transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">Upload your assignment</p>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop your file here, or click to browse
            </p>
            <Input
              type="file"
              accept={acceptedTypes}
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose File
              </label>
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Accepted formats: {acceptedTypes} (Max {maxSize}MB)
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-gray-600">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;
