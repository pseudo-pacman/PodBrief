import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Github, ExternalLink } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  PodBrief
                </h1>
                <p className="text-sm text-gray-600 font-medium">AI Podcast Brief Generator</p>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <SignedOut>
              <a 
                href="#features" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center gap-2 group"
              >
                <span>Features</span>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a 
                href="#about" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center gap-2 group"
              >
                <span>About</span>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a 
                href="https://github.com/yourusername/podbrief" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center gap-2 group"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <Link 
                to="/sign-in"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 