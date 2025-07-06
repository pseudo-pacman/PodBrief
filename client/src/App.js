import React, { useState, useMemo, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LandingPage from './LandingPage';
import MainApp from './MainApp';
import SignInPage from './components/SignIn';

export const AccessibilityContext = createContext();

function App() {
  const [accessibility, setAccessibility] = useState({
    largeFont: false,
    highContrast: false,
    modalOpen: false
  });

  const accessibilityValue = useMemo(() => ({
    ...accessibility,
    setLargeFont: (val) => setAccessibility(a => ({ ...a, largeFont: val })),
    setHighContrast: (val) => setAccessibility(a => ({ ...a, highContrast: val })),
    openModal: () => setAccessibility(a => ({ ...a, modalOpen: true })),
    closeModal: () => setAccessibility(a => ({ ...a, modalOpen: false }))
  }), [accessibility]);

  return (
    <AccessibilityContext.Provider value={accessibilityValue}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route 
            path="/app" 
            element={
              <>
                <SignedIn>
                  <MainApp />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            } 
          />
          <Route path="*" element={<div className="p-8 text-center text-xl">404 — Page Not Found</div>} />
        </Routes>
      </Router>
    </AccessibilityContext.Provider>
  );
}

export default App; 