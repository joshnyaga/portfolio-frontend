"use client";

import { useState, useEffect } from "react";
import { skillService } from "@/services/skillService";
import { Skill } from "@/lib/types";
import { Globe, Server, Terminal, Code } from "lucide-react";
import PortfolioLayout from "@/components/layout/PortfolioLayout";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await skillService.getAll();
        setSkills(data.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const categories = [
    { key: "all", label: "All Skills", icon: Code },
    { key: "frontend", label: "Frontend", icon: Globe },
    { key: "backend", label: "Backend", icon: Server },
    { key: "tools", label: "Tools & Platforms", icon: Terminal },
    { key: "languages", label: "Languages", icon: Code },
  ];

  const filteredSkills =
    selectedCategory === "all"
      ? skills
      : skills.filter((skill) => skill.category === selectedCategory);

  const getSkillsByCategory = () => {
    const skillsByCategory = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);

    // Sort skills within each category by order
    Object.keys(skillsByCategory).forEach((category) => {
      skillsByCategory[category].sort((a, b) => a.order - b.order);
    });

    return skillsByCategory;
  };

  const renderLevelStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          i < level
            ? "bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"
            : "bg-gray-600"
        }`}
      />
    ));
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
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Skills & Technologies
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              My technical arsenal spans the full development stack
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const count =
                  category.key === "all"
                    ? skills.length
                    : skills.filter((s) => s.category === category.key).length;

                return (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                      selectedCategory === category.key
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {category.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills Display */}
          {selectedCategory === "all" ? (
            // Show by categories
            <div className="space-y-12">
              {["frontend", "backend", "tools", "languages"].map(
                (category, categoryIndex) => {
                  const categorySkills = getSkillsByCategory()[category] || [];
                  if (categorySkills.length === 0) return null;

                  const categoryInfo = categories.find(
                    (c) => c.key === category
                  );
                  const CategoryIcon = categoryInfo?.icon || Code;

                  return (
                    <div
                      key={category}
                      className="animate-fadeInUp"
                      style={{ animationDelay: `${categoryIndex * 0.2}s` }}
                    >
                      <div className="flex items-center justify-center mb-8">
                        <CategoryIcon className="h-6 w-6 text-blue-400 mr-3" />
                        <h2 className="text-2xl font-semibold text-blue-400 capitalize">
                          {categoryInfo?.label}
                        </h2>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {categorySkills.map((skill, skillIndex) => (
                          <div
                            key={skill._id}
                            className="group text-center animate-fadeInUp"
                            style={{
                              animationDelay: `${
                                categoryIndex * 0.2 + skillIndex * 0.1
                              }s`,
                            }}
                          >
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-600 hover:border-blue-500/50">
                              <div className="mb-4 flex justify-center">
                                {skill.iconId ? (
                                  <img
                                    src={`/api/images/image/${skill.iconId}`}
                                    alt={skill.name}
                                    className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.style.display = "none";
                                      target.nextElementSibling?.classList.remove(
                                        "hidden"
                                      );
                                    }}
                                  />
                                ) : null}
                                <div
                                  className={`w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ${
                                    skill.iconId ? "hidden" : ""
                                  }`}
                                >
                                  <Code className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <h3 className="font-medium text-sm mb-3 group-hover:text-blue-400 transition-colors">
                                {skill.name}
                              </h3>
                              <div className="flex justify-center space-x-1 mb-2">
                                {renderLevelStars(skill.level)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Level {skill.level}/5
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            // Show filtered skills
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredSkills.map((skill, index) => (
                <div
                  key={skill._id}
                  className="group text-center animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-600 hover:border-blue-500/50">
                    <div className="mb-4 flex justify-center">
                      {skill.iconId ? (
                        <img
                          src={`/api/images/image/${skill.iconId}`}
                          alt={skill.name}
                          className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ${
                          skill.iconId ? "hidden" : ""
                        }`}
                      >
                        <Code className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="font-medium text-sm mb-3 group-hover:text-blue-400 transition-colors">
                      {skill.name}
                    </h3>
                    <div className="flex justify-center space-x-1 mb-2">
                      {renderLevelStars(skill.level)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Level {skill.level}/5
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredSkills.length === 0 && selectedCategory !== "all" && (
            <div className="text-center py-16">
              <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No skills found
              </h3>
              <p className="text-gray-500">No skills in this category yet</p>
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

