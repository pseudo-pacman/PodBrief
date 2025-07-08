import React from 'react';

/**
 * Card component for wrapping content sections in a modern, minimal SaaS style.
 * Props:
 *  - title: string (optional)
 *  - description: string (optional)
 *  - label: ReactNode (optional, for top label/icon)
 *  - highlight: boolean (optional, for AI/active border)
 *  - children: ReactNode
 */
const Card = ({ title, description, label, highlight = false, children, className = '' }) => (
  <div
    className={`bg-white dark:bg-[#1A1A1A] border ${highlight ? 'border-highlight' : 'border-zinc-200 dark:border-zinc-800'} rounded-2xl shadow-md p-6 md:p-8 transition-colors duration-300 font-sans ${className}`}
    style={{ maxWidth: '100%' }}
  >
    {label && (
      <div className="mb-2 text-sm font-semibold text-brand flex items-center gap-2">
        {label}
      </div>
    )}
    {title && (
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-2 text-primary dark:text-primary-dark">
        {title}
      </h2>
    )}
    {description && (
      <p className="text-muted-foreground mb-4 text-base md:text-lg">
        {description}
      </p>
    )}
    <div className="space-y-4">{children}</div>
  </div>
);

export default Card; 