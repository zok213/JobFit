"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle,
  Star,
  ListChecks,
  FileText,
  MessageSquare,
  Monitor,
  Clock,
} from "lucide-react";

interface JobData {
  jobTitle: string;
  companyName: string;
  industry: string;
  location: string;
  remoteOption: string;
  experienceLevel: string;
  employmentType: string;
  keyResponsibilities: string;
  requiredSkills: string;
  preferredSkills: string;
  education: string;
  additionalNotes: string;
  tone: string;
}

interface FormattedJobDescriptionProps {
  jobData: JobData;
  generatedDescription: string;
}

const FormattedJobDescription: React.FC<FormattedJobDescriptionProps> = ({
  jobData,
  generatedDescription,
}) => {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="bg-primary/5 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-primary">
                {jobData.jobTitle}
              </CardTitle>
              <CardDescription className="flex items-center mt-2 text-lg">
                <Building2 className="h-5 w-5 mr-2 text-primary/80" />
                {jobData.companyName}
                {jobData.industry && (
                  <Badge variant="outline" className="ml-2">
                    {jobData.industry}
                  </Badge>
                )}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-sm">{jobData.location}</span>
              </div>
              {jobData.remoteOption && (
                <Badge variant="secondary">
                  <Monitor className="h-3 w-3 mr-1" />
                  {jobData.remoteOption}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3 mb-4">
            {jobData.experienceLevel && (
              <Badge variant="outline" className="flex items-center bg-blue-50">
                <Clock className="h-3 w-3 mr-1" />
                {jobData.experienceLevel}
              </Badge>
            )}
            {jobData.employmentType && (
              <Badge
                variant="outline"
                className="flex items-center bg-green-50"
              >
                <Briefcase className="h-3 w-3 mr-1" />
                {jobData.employmentType}
              </Badge>
            )}
          </div>

          {generatedDescription ? (
            <div className="whitespace-pre-line text-gray-700">
              {generatedDescription}
            </div>
          ) : (
            <div className="space-y-4">
              {jobData.keyResponsibilities && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center text-primary">
                    <ListChecks className="h-5 w-5 mr-2" />
                    Trách nhiệm chính
                  </h3>
                  <p className="pl-7 text-gray-700">
                    {jobData.keyResponsibilities}
                  </p>
                </div>
              )}

              {jobData.requiredSkills && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center text-primary">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Kỹ năng yêu cầu
                  </h3>
                  <p className="pl-7 text-gray-700">{jobData.requiredSkills}</p>
                </div>
              )}

              {jobData.preferredSkills && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center text-primary">
                    <Star className="h-5 w-5 mr-2" />
                    Kỹ năng ưu tiên
                  </h3>
                  <p className="pl-7 text-gray-700">
                    {jobData.preferredSkills}
                  </p>
                </div>
              )}

              {jobData.education && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center text-primary">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Trình độ học vấn
                  </h3>
                  <p className="pl-7 text-gray-700">{jobData.education}</p>
                </div>
              )}

              {jobData.additionalNotes && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center text-primary">
                    <FileText className="h-5 w-5 mr-2" />
                    Thông tin bổ sung
                  </h3>
                  <p className="pl-7 text-gray-700">
                    {jobData.additionalNotes}
                  </p>
                </div>
              )}

              {jobData.tone && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center text-primary">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Tone
                  </h3>
                  <p className="pl-7 text-gray-700">{jobData.tone}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-primary/5 flex justify-between pt-3">
          <p className="text-sm text-gray-500">
            JobFit AI - Mô tả việc làm được hỗ trợ bởi AI
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FormattedJobDescription;
