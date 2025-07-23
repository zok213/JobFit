"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  BookOpen,
  Briefcase,
  Code,
  Globe,
  HeartHandshake,
  Languages,
  Medal,
  MessageCircle,
  Podcast,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface CustomSection {
  id: string;
  title: string;
  content: string;
}

interface CustomSectionsPanelProps {
  sections: CustomSection[];
  onUpdate: (sections: CustomSection[]) => void;
}

export function CustomSectionsPanel({
  sections = [],
  onUpdate,
}: CustomSectionsPanelProps) {
  const [customSections, setCustomSections] =
    useState<CustomSection[]>(sections);

  const handleAddSection = () => {
    const newSection: CustomSection = {
      id: `section-${Date.now()}`,
      title: "",
      content: "",
    };

    const updatedSections = [...customSections, newSection];
    setCustomSections(updatedSections);
    onUpdate(updatedSections);
  };

  const handleRemoveSection = (id: string) => {
    const updatedSections = customSections.filter(
      (section) => section.id !== id
    );
    setCustomSections(updatedSections);
    onUpdate(updatedSections);
  };

  const handleUpdateSection = (
    id: string,
    field: keyof CustomSection,
    value: string
  ) => {
    const updatedSections = customSections.map((section) => {
      if (section.id === id) {
        return {
          ...section,
          [field]: value,
        };
      }
      return section;
    });

    setCustomSections(updatedSections);
    onUpdate(updatedSections);
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">Các phần tùy chỉnh</CardTitle>
        <CardDescription>
          Enhance your resume with additional sections to showcase more of your
          qualifications
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Các phần tùy chỉnh</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSection}
            className="flex items-center gap-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Thêm phần</span>
          </Button>
        </div>

        {customSections.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500 mb-4">Chưa có phần tùy chỉnh nào</p>
            <Button
              variant="outline"
              onClick={handleAddSection}
              className="flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Thêm phần tùy chỉnh</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {customSections.map((section, index) => (
              <div
                key={section.id}
                className="space-y-4 border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Phần tùy chỉnh {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSection(section.id)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`section-title-${section.id}`}>
                    Tiêu đề phần
                  </Label>
                  <Input
                    id={`section-title-${section.id}`}
                    value={section.title}
                    onChange={(e) =>
                      handleUpdateSection(section.id, "title", e.target.value)
                    }
                    placeholder="Ví dụ: Giải thưởng, Ấn phẩm, Chứng chỉ..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`section-content-${section.id}`}>
                    Nội dung
                  </Label>
                  <Textarea
                    id={`section-content-${section.id}`}
                    value={section.content}
                    onChange={(e) =>
                      handleUpdateSection(section.id, "content", e.target.value)
                    }
                    placeholder="Thêm nội dung cho phần này..."
                    rows={5}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {customSections.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSection}
            className="flex items-center gap-1.5 mt-4"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Thêm phần tùy chỉnh khác</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
