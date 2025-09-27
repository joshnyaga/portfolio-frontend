"use client";

import { useState, useEffect } from "react";
import {
  Code2,
  Zap,
  Brain,
  Rocket,
  Terminal,
  Coffee,
  Music,
  Gamepad2,
  MapPin,
  Calendar,
  Mail,
  Github,
  Linkedin,
  Download,
  ChevronRight,
  Sparkles,
  User,
  Award,
  Target,
} from "lucide-react";
import PortfolioLayout from "@/components/layout/PortfolioLayout";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("interests");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);


  const interests = [
    {
      icon: Coffee,
      title: "Coffee Enthusiast",
      desc: "Fueled by caffeine and curiosity",
    },
    {
      icon: Music,
      title: "Music Production",
      desc: "Creating beats in my spare time",
    },
    {
      icon: Gamepad2,
      title: "Gaming",
      desc: "Strategy games and indie titles",
    },
    {
      icon: Brain,
      title: "AI Research",
      desc: "Exploring the future of technology",
    },
  ];


  const values = [
    {
      icon: Code2,
      title: "Clean Code",
      desc: "Writing maintainable, scalable solutions",
    },
    {
      icon: Rocket,
      title: "Innovation",
      desc: "Always exploring new technologies",
    },
    {
      icon: Target,
      title: "User-Focused",
      desc: "Building experiences that matter",
    },
    {
      icon: Award,
      title: "Excellence",
      desc: "Striving for quality in every project",
    },
  ];

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">
                About Me
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Hello, I'm John
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              A passionate full-stack developer who loves crafting beautiful,
              functional experiences and pushing the boundaries of what's
              possible with code.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-1">
              {[
               
                { id: "interests", label: "Interests", icon: Rocket },
                { id: "values", label: "Values", icon: Sparkles },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                    activeTab === id
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fadeInUp">
          

            {activeTab === "interests" && (
              <div>
                <h2 className="text-3xl font-bold text-center mb-12 text-purple-400">
                  What I Love
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {interests.map((interest, index) => {
                    const Icon = interest.icon;
                    return (
                      <div
                        key={interest.title}
                        className="group bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl animate-fadeInUp text-center"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors duration-300">
                          <Icon className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                          {interest.title}
                        </h3>
                        <p className="text-gray-400">{interest.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "values" && (
              <div>
                <h2 className="text-3xl font-bold text-center mb-12 text-green-400">
                  Core Values
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {values.map((value, index) => {
                    const Icon = value.icon;
                    return (
                      <div
                        key={value.title}
                        className="group bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700 hover:border-green-500/50 transition-all duration-500 transform hover:scale-105 animate-fadeInUp"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300">
                            <Icon className="w-6 h-6 text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold mb-3 group-hover:text-green-400 transition-colors">
                              {value.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                              {value.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
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
