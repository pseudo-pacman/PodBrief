import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Github, ExternalLink, Moon, Sun } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const Header = () => {
  // Dark mode toggle logic
  const [dark, setDark] = useState(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <header className="bg-white dark:bg-[#121212] transition-colors duration-300 backdrop-blur-md shadow-sm border-b border-zinc-200/50 dark:border-zinc-800/80 sticky top-0 z-50 font-sans">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-brand to-brand-dark rounded-xl shadow-lg">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
                  PodBrief
                </h1>
                <p className="text-sm text-muted-foreground font-medium">AI Podcast Brief Generator</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand"
              onClick={() => setDark((d) => !d)}
            >
              {dark ? <Sun className="w-5 h-5 text-brand" /> : <Moon className="w-5 h-5 text-brand" />}
            </button>
            <nav className="hidden md:flex items-center gap-8">
              <SignedOut>
                <a 
                  href="#features" 
                  className="text-muted-foreground hover:text-brand transition-colors duration-200 font-medium flex items-center gap-2 group"
                >
                  <span>Features</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a 
                  href="#about" 
                  className="text-muted-foreground hover:text-brand transition-colors duration-200 font-medium flex items-center gap-2 group"
                >
                  <span>About</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a 
                  href="https://github.com/yourusername/podbrief" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-brand transition-colors duration-200 font-medium flex items-center gap-2 group"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <Link 
                  to="/sign-in"
                  className="bg-gradient-to-r from-brand to-brand-dark text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
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
      </div>
    </header>
  );
};

export default Header; 