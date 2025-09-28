"use client"

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  Terminal, 
  Code2, 
  Zap,
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const [glitchText, setGlitchText] = useState('404');
  const [isSearching, setIsSearching] = useState(false);
  const [consoleLines, setConsoleLines] = useState([
    '> Scanning for requested resource...',
    '> ERROR: Resource not found',
    '> Checking alternative routes...',
    '> No matches found in database'
  ]);
  const router = useRouter();

  // Glitch effect for 404 text
  useEffect(() => {
    const glitchChars = ['4', '0', '4', '@', '#', '$', '%', '&', '*'];
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * 3);
      const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
      const newText = glitchText.split('');
      newText[randomIndex] = randomChar;
      setGlitchText(newText.join(''));
      
      setTimeout(() => setGlitchText('404'), 100);
    }, 2000);

    return () => clearInterval(interval);
  }, [glitchText]);

  // Console animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setConsoleLines(prev => [...prev, '> Initializing recovery protocols...']);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      router.push('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
      {/* Animated Tech Background */}
      <div className="fixed inset-0 z-0">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
        
        {/* Floating Code Elements */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-20 text-blue-400 font-mono text-xs"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            >
              {['{ }', '[ ]', '</>', '&&', '||', '=>', '!=', '===', 'null', 'undefined'][Math.floor(Math.random() * 10)]}
            </div>
          ))}
        </div>
        
        {/* Particle System */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 4}s`
              }}
            >
              <div className="w-1 h-1 bg-blue-400 rounded-full opacity-30"></div>
            </div>
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        
        {/* Glitch 404 Text */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 animate-pulse glitch-text">
            {glitchText}
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-purple-500 mx-auto mt-4 animate-pulse"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-yellow-400">
            <AlertTriangle className="h-6 w-6 animate-bounce" />
            <h2 className="text-2xl md:text-3xl font-semibold">Page Not Found</h2>
          </div>
          <p className="text-gray-400 text-lg max-w-md">
            The page you're looking for seems to have escaped into the digital void.
          </p>
        </div>

        {/* Terminal Console */}
        <div className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-8 max-w-md w-full font-mono text-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-400">terminal</span>
          </div>
          <div className="space-y-2">
            {consoleLines.map((line, index) => (
              <div 
                key={index} 
                className="text-green-400 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                {line}
              </div>
            ))}
            <div className="flex items-center space-x-1">
              <span className="text-green-400"></span>
              <div className="w-2 h-4 bg-green-400 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <Home className="h-5 w-5" />
            <span>Return Home</span>
          </button>

          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 border border-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>

          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            <span>{isSearching ? 'Searching...' : 'Search Site'}</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/projects" 
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1 group"
            >
              <Code2 className="h-4 w-4 group-hover:animate-bounce" />
              <span>Projects</span>
            </a>
            <a 
              href="/about" 
              className="text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-1 group"
            >
              <Terminal className="h-4 w-4 group-hover:animate-bounce" />
              <span>About</span>
            </a>
            <a 
              href="/contact" 
              className="text-green-400 hover:text-green-300 transition-colors flex items-center space-x-1 group"
            >
              <Zap className="h-4 w-4 group-hover:animate-bounce" />
              <span>Contact</span>
            </a>
          </div>
        </div>

        {/* Fun Easter Egg */}
        <div className="mt-16 text-center">
          <button 
            onClick={() => window.open('https://http.cat/404', '_blank')}
            className="text-gray-500 hover:text-gray-400 transition-colors text-sm flex items-center space-x-1 group"
          >
            <span>Need a laugh?</span>
            <ExternalLink className="h-3 w-3 group-hover:animate-bounce" />
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.2; 
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 0.4; 
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glitch {
          0%, 100% { 
            text-shadow: 
              0.05em 0 0 #ff0000, 
              -0.03em -0.04em 0 #00ff00, 
              0.025em 0.04em 0 #0000ff;
          }
          15% { 
            text-shadow: 
              0.05em 0 0 #ff0000, 
              -0.03em -0.04em 0 #00ff00, 
              0.025em 0.04em 0 #0000ff;
          }
          16% { 
            text-shadow: 
              -0.05em -0.025em 0 #ff0000, 
              0.025em 0.035em 0 #00ff00, 
              -0.05em -0.05em 0 #0000ff;
          }
          49% { 
            text-shadow: 
              -0.05em -0.025em 0 #ff0000, 
              0.025em 0.035em 0 #00ff00, 
              -0.05em -0.05em 0 #0000ff;
          }
          50% { 
            text-shadow: 
              0.05em 0.035em 0 #ff0000, 
              0.03em 0 0 #00ff00, 
              0 -0.04em 0 #0000ff;
          }
          99% { 
            text-shadow: 
              0.05em 0.035em 0 #ff0000, 
              0.03em 0 0 #00ff00, 
              0 -0.04em 0 #0000ff;
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .glitch-text {
          animation: glitch 1s linear infinite;
        }
        
        /* Add some responsive glow effects */
        @media (min-width: 768px) {
          .glitch-text {
            filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.4));
          }
        }

        /* Scrollbar styling for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}