"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Code, Zap } from "lucide-react";

export default function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const [currentRole, setCurrentRole] = useState(0);

  const roles = [
    "Full-Stack Developer",
    "Problem Solver",
    "Code Architect",
    "Tech Enthusiast",
  ];

  // Typing animation effect
  useEffect(() => {
    const text = roles[currentRole];
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1));
        index++;
      } else {
        setTimeout(() => {
          setCurrentRole((prev) => (prev + 1) % roles.length);
          setTypedText("");
        }, 2000);
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [currentRole]);

  return (
    <section className="min-h-screen flex items-center justify-center relative pt-20">
      <div className="text-center max-w-4xl mx-auto px-4">
        <div className="animate-fadeInUp">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent animate-gradient">
              Joshua Kithinji
            </span>
          </h1>
          <div className="text-xl md:text-2xl text-gray-300 mb-8 h-8">
            <span className="font-mono">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </div>
        </div>

        <div className="animate-fadeInUp animation-delay-300">
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            I craft digital experiences with clean code, innovative solutions,
            and modern technologies. Passionate about building scalable
            applications that make a difference.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp animation-delay-500">
          <a
            href="/projects"
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <span className="flex items-center justify-center">
              <Code className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              View My Work
            </span>
          </a>
          <a
            href="/contact"
            className="group border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
          >
            <span className="flex items-center justify-center">
              <Zap className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Get In Touch
            </span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-gray-400" />
      </div>

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

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  );
}
