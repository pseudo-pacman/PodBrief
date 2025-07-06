import React from "react";
import { Link } from "react-router-dom";

// Google Fonts import (Inter)
const fontLink = (
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap"
    rel="stylesheet"
  />
);

const features = [
  {
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 3v18m9-9H3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "AI-Powered Briefs",
    desc: "Generate guest bios, questions, intros & outros instantly.",
  },
  {
    icon: (
      <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 17v4m0 0H8m4 0h4M4 7V5a2 2 0 012-2h12a2 2 0 012 2v2M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Save & Export",
    desc: "Download PDFs or save your briefs for later use.",
  },
  {
    icon: (
      <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Collaborate Easily",
    desc: "Share briefs with your team and work together.",
  },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    features: [
      "Unlimited brief generation",
      "Save up to 5 briefs",
      "PDF export",
      "Basic support",
    ],
    button: "Sign Up Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12/mo",
    features: [
      "Unlimited briefs & exports",
      "Advanced AI options",
      "Priority support",
      "Remove PodBrief branding",
    ],
    button: "Start Pro Trial",
    highlight: true,
  },
  {
    name: "Team",
    price: "$29/mo",
    features: [
      "All Pro features",
      "Team collaboration",
      "Shared brief library",
      "Admin controls",
    ],
    button: "Contact Sales",
    highlight: false,
  },
];

const testimonials = [
  {
    name: "Alex Rivera",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "PodBrief saves me hours every week. The AI-generated questions are spot on and the PDF export is a game changer for my workflow.",
  },
  {
    name: "Jamie Chen",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "I love how easy it is to prep for interviews now. The team features make collaboration seamless for our podcast staff.",
  },
  {
    name: "Morgan Lee",
    photo: "https://randomuser.me/api/portraits/men/65.jpg",
    quote:
      "The interface is beautiful and intuitive. PodBrief is now an essential tool for my show.",
  },
];

export default function LandingPage() {
  return (
    <>
      {fontLink}
      <div className="font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Hero Section */}
        <header>
          <div
            className="relative w-full min-h-[70vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-16"
            style={{
              background:
                "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)",
            }}
          >
            {/* Left: Text */}
            <div className="w-full md:w-1/2 text-white z-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg">
                PodBrief — The Ultimate Podcast Interview Brief Generator
              </h1>
              <p className="text-lg md:text-xl font-medium mb-8 max-w-xl drop-shadow">
                Save time prepping for your guests with AI-powered interview briefs.
              </p>
              <Link
                to="/app"
                className="inline-block px-8 py-4 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-white transition"
                tabIndex={0}
                aria-label="Get Started Free"
              >
                Get Started Free
              </Link>
            </div>
            {/* Right: Illustration */}
            <div className="w-full md:w-1/2 flex justify-center mt-12 md:mt-0">
              <img
                src="https://undraw.co/api/illustrations/2e7e7e7e-2e7e-4e7e-8e7e-2e7e7e7e7e7e"
                alt="Podcast illustration"
                className="w-[320px] h-[240px] md:w-[400px] md:h-[300px] object-contain rounded-2xl shadow-2xl bg-white/20"
                style={{ minWidth: 200, minHeight: 150 }}
              />
            </div>
            {/* Decorative gradient overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12) 0, transparent 70%)",
              }}
            />
          </div>
        </header>

        <main>
          {/* Features Section */}
          <section
            id="features"
            className="w-full max-w-6xl mx-auto py-16 px-4"
            aria-labelledby="features-title"
          >
            <h2
              id="features-title"
              className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900"
            >
              Why PodBrief?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition"
                  tabIndex={0}
                  aria-label={f.title}
                >
                  <div className="mb-4">{f.icon}</div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing Section */}
          <section
            id="pricing"
            className="w-full max-w-6xl mx-auto py-16 px-4"
            aria-labelledby="pricing-title"
          >
            <h2
              id="pricing-title"
              className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900"
            >
              Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricing.map((tier, idx) => (
                <div
                  key={tier.name}
                  className={`flex flex-col items-center rounded-2xl shadow-lg p-8 bg-white border-2 ${
                    tier.highlight
                      ? "border-blue-600 scale-105 z-10 shadow-2xl"
                      : "border-gray-200"
                  } transition`}
                  aria-label={`${tier.name} plan`}
                  tabIndex={0}
                >
                  <div
                    className={`text-lg font-bold mb-2 ${
                      tier.highlight ? "text-blue-700" : "text-gray-900"
                    }`}
                  >
                    {tier.name}
                  </div>
                  <div className="text-3xl font-extrabold mb-4">
                    {tier.price}
                  </div>
                  <ul className="mb-6 space-y-2">
                    {tier.features.map((f) => (
                      <li key={f} className="text-gray-700 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                      tier.highlight
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                    aria-label={tier.button}
                  >
                    {tier.button}
                  </button>
                  {tier.highlight && (
                    <div className="mt-3 text-xs text-blue-600 font-semibold uppercase tracking-wide">
                      Recommended
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Testimonial Section */}
          <section
            id="testimonials"
            className="w-full max-w-5xl mx-auto py-16 px-4"
            aria-labelledby="testimonials-title"
          >
            <h2
              id="testimonials-title"
              className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900"
            >
              What Podcasters Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <figure
                  key={t.name}
                  className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center"
                  tabIndex={0}
                  aria-label={`Testimonial from ${t.name}`}
                >
                  <img
                    src={t.photo}
                    alt={`Photo of ${t.name}`}
                    className="w-16 h-16 rounded-full mb-4 object-cover border-2 border-blue-200"
                  />
                  <blockquote className="text-gray-700 italic mb-4">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="text-blue-700 font-semibold">
                    {t.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-8 mt-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-4">
            <div className="text-lg font-bold mb-2 md:mb-0">PodBrief</div>
            <nav className="flex flex-wrap gap-6 text-sm font-medium">
              <a
                href="#about"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
              >
                About
              </a>
              <a
                href="#contact"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
              >
                Contact
              </a>
              <a
                href="#privacy"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
              >
                Terms of Service
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
} 