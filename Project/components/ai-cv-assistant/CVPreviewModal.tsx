"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

interface CVPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: any;
  onExportPDF: () => void;
}

export function CVPreviewModal({ isOpen, onClose, cvData, onExportPDF }: CVPreviewModalProps) {
  if (!isOpen) return null;

  const fullName = `${cvData.personal?.firstName || ''} ${cvData.personal?.lastName || ''}`.trim() || 'Your Name';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Xem trước CV</h2>
            <p className="text-sm text-gray-600 mt-1">Xem CV của bạn như nhà tuyển dụng sẽ thấy</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={onExportPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất PDF
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* CV Content */}
        <div className="p-8 bg-gray-50 max-h-[70vh] overflow-y-auto">
          <Card className="bg-white shadow-lg">
            <div className="p-8">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-t-lg -m-8 mb-8">
                <div className="flex items-start gap-6">
                  {cvData.personal?.photoUrl && (
                    <div className="w-24 h-24 rounded-full bg-white p-1 flex-shrink-0">
                      <img 
                        src={cvData.personal.photoUrl} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{fullName}</h1>
                    <p className="text-xl text-blue-100 mb-3">{cvData.personal?.jobTitle || 'Professional Title'}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                      {cvData.personal?.email && <span>📧 {cvData.personal.email}</span>}
                      {cvData.personal?.phone && <span>📱 {cvData.personal.phone}</span>}
                      {cvData.personal?.location && <span>📍 {cvData.personal.location}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {cvData.summary && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
                    PROFESSIONAL SUMMARY
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
                </div>
              )}

              {/* Work Experience */}
              {cvData.experience?.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
                    WORK EXPERIENCE
                  </h2>
                  {cvData.experience.map((exp: any, index: number) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {exp.jobTitle || exp.title} at {exp.company}
                        </h3>
                        <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </span>
                      </div>
                      {exp.location && (
                        <p className="text-sm text-gray-600 mb-2">{exp.location}</p>
                      )}
                      {exp.description && (
                        <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {cvData.education?.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
                    EDUCATION
                  </h2>
                  {cvData.education.map((edu: any, index: number) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {edu.degree} in {edu.fieldOfStudy || edu.field}
                        </h3>
                        <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                          {edu.graduationDate || edu.endDate}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-1">{edu.school}</p>
                      {edu.description && (
                        <p className="text-gray-600 text-sm">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {cvData.skills?.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
                    SKILLS
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {cvData.skills.map((skill: any, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill.name || skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {cvData.links?.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
                    LINKS
                  </h2>
                  <div className="space-y-2">
                    {cvData.links.map((link: any, index: number) => (
                      <div key={index}>
                        <span className="text-gray-700 font-medium">{link.label || link.name}: </span>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {link.url}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Đóng
          </Button>
          <Button
            onClick={onExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
