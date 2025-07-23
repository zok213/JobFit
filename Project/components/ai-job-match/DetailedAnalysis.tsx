"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { useJobMatchStore } from "@/store/jobMatchStore";
import {
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  GraduationCap,
  Book,
  Award,
} from "lucide-react";

export function DetailedAnalysis() {
  const { matchResult } = useJobMatchStore();

  if (!matchResult) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          Phân tích chi tiết không khả dụng
        </div>
      </Card>
    );
  }

  return (
    <div className="detailed-analysis">
      <div className="relative overflow-hidden rounded-xl shadow-md border border-gray-200 bg-white">
        <div className="px-6 py-6 sm:px-10 sm:py-8">
          <h1 className="text-2xl font-bold mb-8 text-slate-900 relative inline-block">
            Job Match Analysis
            <div className="absolute -bottom-2 w-full h-1 bg-gradient-to-r from-lime-400 to-green-600"></div>
          </h1>

          {/* Match Score Section */}
          <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 shadow-sm">
            <div className="flex items-center mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                <Award size={18} />
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                1. Match Score: <span className="text-green-600">75%</span>
              </h2>
            </div>
            <p className="text-slate-700">
              The candidate's CV demonstrates a strong alignment with the job
              description, particularly in key technical skills and experience.
              However, there are some areas for improvement, primarily in
              demonstrating familiarity with RESTful APIs and GraphQL, and
              showcasing experience in designing and implementing complex
              frontend solutions. The candidate's 3 years of experience exceeds
              the minimum requirement of 2 years.
            </p>
          </div>

          {/* Skills Match Section */}
          <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 shadow-sm">
            <div className="flex items-center mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 mr-3">
                <CheckCircle size={18} />
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                2. Skills Match
              </h2>
            </div>

            <div className="pl-2 mb-4">
              <h3 className="font-semibold text-slate-800 mb-2">
                Matching Skills:
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pl-5 list-disc mb-4">
                <li className="text-slate-700">JavaScript</li>
                <li className="text-slate-700">TypeScript</li>
                <li className="text-slate-700">React</li>
                <li className="text-slate-700">NextJS</li>
                <li className="text-slate-700">HTML</li>
                <li className="text-slate-700">CSS</li>
                <li className="text-slate-700">Tailwind CSS</li>
                <li className="text-slate-700">Node.js</li>
                <li className="text-slate-700">Express</li>
                <li className="text-slate-700">Git</li>
                <li className="text-slate-700">Docker</li>
              </ul>
            </div>

            <div className="pl-2 mb-4">
              <h3 className="font-semibold text-red-700 mb-2">
                Missing Skills:
              </h3>
              <ul className="pl-5 list-disc mb-4">
                <li className="text-slate-700">RESTful APIs</li>
                <li className="text-slate-700">GraphQL</li>
                <li className="text-slate-700">
                  Experience with state management in React (explicitly
                  mentioned in the job description)
                </li>
              </ul>
            </div>

            <div className="pl-2">
              <h3 className="font-semibold text-indigo-700 mb-2">
                Exceeding Skills:
              </h3>
              <ul className="pl-5 list-disc">
                <li className="text-slate-700">
                  The candidate possesses skills in Node.js and Express, which,
                  while not explicitly required, are valuable for a well-rounded
                  frontend developer.
                </li>
              </ul>
            </div>
          </div>

          {/* Experience Match Section */}
          <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border-l-4 border-purple-500 shadow-sm">
            <div className="flex items-center mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-3">
                <TrendingUp size={18} />
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                3. Experience Match
              </h2>
            </div>
            <p className="text-slate-700">
              The job description requires a minimum of 2 years of experience
              with React, TypeScript, and modern frontend technologies. The
              candidate has 3 years of experience as a Frontend Developer,
              indicating a good match in terms of overall experience. The CV
              explicitly mentions experience with React and TypeScript. However,
              the CV doesn't provide specific details on the types of projects
              or the complexity of the frontend solutions the candidate has
              worked on.
            </p>
          </div>

          {/* Education Match Section */}
          <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500 shadow-sm">
            <div className="flex items-center mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-3">
                <GraduationCap size={18} />
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                4. Education Match
              </h2>
            </div>
            <p className="text-slate-700">
              The job description does not specify any educational requirements.
              Therefore, this section is not applicable.
            </p>
          </div>

          {/* Key Strengths Section */}
          <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-yellow-500 shadow-sm">
            <div className="flex items-center mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mr-3">
                <Star size={18} />
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                5. Key Strengths
              </h2>
            </div>
            <ul className="pl-5 list-disc mb-0">
              <li className="text-slate-700 mb-2">
                <strong>Strong Frontend Skill Set:</strong> The candidate
                possesses a solid foundation in essential frontend technologies
                like React, TypeScript, NextJS, HTML, CSS, and Tailwind CSS.
              </li>
              <li className="text-slate-700 mb-2">
                <strong>Relevant Experience:</strong> With 3 years of experience
                as a Frontend Developer, the candidate has practical experience
                in building user interfaces.
              </li>
              <li className="text-slate-700">
                <strong>Modern Tech Stack Familiarity:</strong> The candidate's
                familiarity with NextJS and Tailwind CSS demonstrates an
                understanding of modern frontend development practices.
              </li>
            </ul>
          </div>

          {/* Improvement Areas Section */}
          <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 shadow-sm">
            <div className="flex items-center mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 mr-3">
                <AlertCircle size={18} />
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                6. Improvement Areas
              </h2>
            </div>
            <ul className="pl-5 list-disc mb-0">
              <li className="text-slate-700 mb-2">
                <strong>API and Data Fetching:</strong> Gaining experience with
                RESTful APIs and GraphQL would significantly enhance the
                candidate's profile.
              </li>
              <li className="text-slate-700 mb-2">
                <strong>Complex Frontend Solutions:</strong> The candidate
                should showcase experience in designing and implementing complex
                frontend architectures and features.
              </li>
              <li className="text-slate-700">
                <strong>State Management:</strong> Explicitly demonstrating
                experience with state management libraries like Redux, Zustand,
                or React Context will strengthen their application.
              </li>
            </ul>
          </div>

          {/* Recommendations Section */}
          <div className="p-6 rounded-lg bg-gradient-to-r from-teal-50 to-emerald-50 border-l-4 border-teal-500 shadow-sm">
            <div className="flex items-center mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-600 mr-3">
                <Book size={18} />
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                7. Recommendations
              </h2>
            </div>
            <ul className="pl-5 list-disc mb-0">
              <li className="text-slate-700 mb-2">
                <strong>Highlight API Experience:</strong> Even if the candidate
                has limited experience with APIs, they should highlight any
                projects where they consumed data from external sources.
              </li>
              <li className="text-slate-700 mb-2">
                <strong>Showcase Complex Projects:</strong> The candidate should
                provide more details about the projects they have worked on,
                emphasizing the complexity of the frontend solutions they
                developed.
              </li>
              <li className="text-slate-700 mb-2">
                <strong>Address Missing Skills:</strong> The candidate should
                consider taking online courses or working on personal projects
                to gain experience with RESTful APIs, GraphQL, and state
                management in React.
              </li>
              <li className="text-slate-700">
                <strong>Quantify Achievements:</strong> Whenever possible, the
                candidate should quantify their achievements in previous roles
                (e.g., "Improved website performance by 20% by implementing code
                splitting").
              </li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .detailed-analysis {
          font-family: var(--font-space-grotesk), system-ui, sans-serif;
        }

        .detailed-analysis h1 {
          font-weight: 700;
        }

        .detailed-analysis h2 {
          font-weight: 700;
        }

        .detailed-analysis strong {
          color: #374151;
          font-weight: 600;
        }

        .detailed-analysis ul {
          margin-bottom: 0;
        }

        .detailed-analysis li {
          margin-bottom: 0.25rem;
        }

        /* Animation effects */
        .detailed-analysis > div > div > div {
          opacity: 0;
          transform: translateY(10px);
          animation: slideIn 0.5s forwards;
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .detailed-analysis > div > div > div:nth-child(1) {
          animation-delay: 0.1s;
        }
        .detailed-analysis > div > div > div:nth-child(2) {
          animation-delay: 0.2s;
        }
        .detailed-analysis > div > div > div:nth-child(3) {
          animation-delay: 0.3s;
        }
        .detailed-analysis > div > div > div:nth-child(4) {
          animation-delay: 0.35s;
        }
        .detailed-analysis > div > div > div:nth-child(5) {
          animation-delay: 0.4s;
        }
        .detailed-analysis > div > div > div:nth-child(6) {
          animation-delay: 0.45s;
        }
        .detailed-analysis > div > div > div:nth-child(7) {
          animation-delay: 0.5s;
        }
        .detailed-analysis > div > div > div:nth-child(8) {
          animation-delay: 0.55s;
        }
        .detailed-analysis > div > div > div:nth-child(9) {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
}
