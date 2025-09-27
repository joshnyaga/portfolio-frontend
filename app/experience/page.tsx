"use client";

import { useState, useEffect } from "react";
import { experienceService } from "@/services/experienceService";
import { Experience } from "@/lib/types";
import {
  Calendar,
  MapPin,
  Building,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import PortfolioLayout from "@/components/layout/PortfolioLayout";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await experienceService.getAll();
        setExperiences(data.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const calculateDuration = (
    startDate: string,
    endDate: string | undefined
  ) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? "s" : ""}`;
    } else {
      return `${years} year${years !== 1 ? "s" : ""} ${remainingMonths} month${
        remainingMonths !== 1 ? "s" : ""
      }`;
    }
  };

  if (loading) {
    return (
      <PortfolioLayout>
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </PortfolioLayout>
    );
  }

  return (
    <PortfolioLayout>
      <section className="py-20 pt-32">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16 animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Professional Journey
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              My career path and professional milestones
            </p>
          </div>

          {/* Experience Timeline */}
          {experiences.length > 0 ? (
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div
                  key={exp._id}
                  className="relative animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {index !== experiences.length - 1 && (
                    <div className="absolute left-4 top-16 w-0.5 h-full bg-gradient-to-b from-blue-400 to-purple-400 opacity-30"></div>
                  )}
                  <div className="flex items-start space-x-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-3 h-3 bg-blue-200 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] border border-gray-700 hover:border-blue-500/50 group">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <h2 className="text-2xl font-semibold group-hover:text-blue-400 transition-colors mb-2 lg:mb-0">
                          {exp.position}
                        </h2>
                        <div className="flex items-center text-blue-400 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(exp.startDate)} -{" "}
                          {exp.current ? "Present" : formatDate(exp.endDate!)}
                          <span className="ml-2 text-gray-400">
                            ({calculateDuration(exp.startDate, exp.endDate)})
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-blue-400" />
                          {exp.companyUrl ? (
                            <a
                              href={exp.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-lg text-blue-400 hover:text-blue-300 transition-colors flex items-center group-hover:underline"
                            >
                              {exp.company}
                              <ExternalLink className="h-4 w-4 ml-1" />
                            </a>
                          ) : (
                            <span className="text-lg text-blue-400">
                              {exp.company}
                            </span>
                          )}
                        </div>

                        {exp.location && (
                          <div className="flex items-center text-gray-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            {exp.location}
                          </div>
                        )}

                        {exp.current && (
                          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                            Current Position
                          </span>
                        )}
                      </div>

                      <div className="prose prose-sm max-w-none text-gray-300">
                        {exp.description
                          .split("\n")
                          .map((paragraph, pIndex) => (
                            <p key={pIndex} className="mb-3 leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No work experience yet
              </h3>
              <p className="text-gray-500">Professional timeline coming soon</p>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </PortfolioLayout>
  );
}
