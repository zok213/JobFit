"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Clock, Download, Eye, Trash2, RotateCcw } from "lucide-react";

interface CVVersion {
  id: string;
  timestamp: number;
  date: string;
  name: string;
  data: any;
}

interface CVHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (version: CVVersion) => void;
  onPreview: (version: CVVersion) => void;
}

export function CVHistoryModal({ isOpen, onClose, onRestore, onPreview }: CVHistoryModalProps) {
  const [versions, setVersions] = useState<CVVersion[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadVersions();
    }
  }, [isOpen]);

  const loadVersions = () => {
    try {
      const savedVersions = localStorage.getItem('cv-versions');
      if (savedVersions) {
        setVersions(JSON.parse(savedVersions));
      } else {
        // Check if there's current CV
        const currentCV = localStorage.getItem('cv-builder-data');
        if (currentCV) {
          const currentVersion: CVVersion = {
            id: 'current',
            timestamp: Date.now(),
            date: new Date().toISOString(),
            name: 'Phiên bản hiện tại',
            data: JSON.parse(currentCV)
          };
          setVersions([currentVersion]);
        }
      }
    } catch (error) {
      console.error('Error loading versions:', error);
    }
  };

  const saveCurrentAsVersion = () => {
    try {
      const currentCV = localStorage.getItem('cv-builder-data');
      if (!currentCV) {
        alert('⚠️ Không tìm thấy CV để lưu!');
        return;
      }

      const cvData = JSON.parse(currentCV);
      const fullName = `${cvData.personal?.firstName || ''} ${cvData.personal?.lastName || ''}`.trim();
      
      const newVersion: CVVersion = {
        id: `v-${Date.now()}`,
        timestamp: Date.now(),
        date: new Date().toISOString(),
        name: `${fullName || 'CV'} - ${new Date().toLocaleString('vi-VN')}`,
        data: cvData
      };

      const updatedVersions = [newVersion, ...versions];
      setVersions(updatedVersions);
      localStorage.setItem('cv-versions', JSON.stringify(updatedVersions));
      
      alert('✅ Đã lưu phiên bản CV thành công!');
    } catch (error) {
      console.error('Error saving version:', error);
      alert('❌ Lỗi khi lưu phiên bản!');
    }
  };

  const deleteVersion = (versionId: string) => {
    if (!confirm('Bạn có chắc muốn xóa phiên bản này?')) return;
    
    const updatedVersions = versions.filter(v => v.id !== versionId);
    setVersions(updatedVersions);
    localStorage.setItem('cv-versions', JSON.stringify(updatedVersions));
  };

  const exportVersion = async (version: CVVersion) => {
    try {
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(version.data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_${version.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Có lỗi khi xuất PDF!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="h-6 w-6 text-amber-600" />
              Lịch sử thay đổi CV
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý và khôi phục các phiên bản CV của bạn
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Save current version button */}
          <div className="mb-6">
            <Button
              onClick={saveCurrentAsVersion}
              className="bg-amber-600 hover:bg-amber-700 text-white w-full"
            >
              <Clock className="h-4 w-4 mr-2" />
              Lưu phiên bản hiện tại
            </Button>
          </div>

          {/* Versions list */}
          {versions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có phiên bản nào được lưu</p>
              <p className="text-sm text-gray-400 mt-2">
                Nhấn nút "Lưu phiên bản hiện tại" để bắt đầu
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {versions.map((version) => (
                <Card key={version.id} className="border border-gray-200 hover:border-amber-300 transition-all">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {version.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {new Date(version.date).toLocaleString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onPreview(version)}
                          className="hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportVersion(version)}
                          className="hover:bg-green-50 hover:border-green-300"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (confirm('Khôi phục phiên bản này? CV hiện tại sẽ bị ghi đè.')) {
                              onRestore(version);
                            }
                          }}
                          className="hover:bg-amber-50 hover:border-amber-300"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        
                        {version.id !== 'current' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteVersion(version.id)}
                            className="hover:bg-red-50 hover:border-red-300 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Tổng cộng: <strong>{versions.length}</strong> phiên bản
          </p>
          <Button onClick={onClose} variant="outline">
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
