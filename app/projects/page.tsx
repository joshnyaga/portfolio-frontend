"use client";

import { useState, useEffect } from "react";
import { projectService } from "@/services/projectService";
import { Project } from "@/lib/types";
import { Star, ExternalLink, Github, Code, Filter } from "lucide-react";
import PortfolioLayout from "@/components/layout/PortfolioLayout";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "featured">("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getAll();
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (filter === "featured") {
      setFilteredProjects(projects.filter((p) => p.featured));
    } else {
      setFilteredProjects(projects);
    }
  }, [filter, projects]);

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
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              My Projects
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              A showcase of my work, featuring modern technologies and
              innovative solutions
            </p>

            {/* Filter */}
            <div className="flex justify-center items-center space-x-4">
              <Filter className="h-5 w-5 text-blue-400" />
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  All Projects ({projects.length})
                </button>
                <button
                  onClick={() => setFilter("featured")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    filter === "featured"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  Featured ({projects.filter((p) => p.featured).length})
                </button>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project._id}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl border border-gray-700 hover:border-blue-500/50 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  {project.imageId ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${project.imageUrl}`}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                      <Code className="h-16 w-16 text-blue-400" />
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 px-3 py-1 rounded-full text-xs font-medium flex items-center animate-pulse">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-600/30 hover:bg-blue-600/30 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-gray-500 text-sm">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors hover:scale-110 transform p-2 rounded-lg hover:bg-blue-400/10"
                          title="View Live Project"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-300 transition-colors hover:scale-110 transform p-2 rounded-lg hover:bg-gray-400/10"
                          title="View Source Code"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500">
                Check back later for more projects
              </p>
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

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </PortfolioLayout>
  );
}
