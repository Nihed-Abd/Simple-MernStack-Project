import React from 'react';

const Spinner = ({ size = 'medium', fullPage = false }) => {
  // Convert size prop to corresponding Tailwind classes
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }[size] || 'w-12 h-12';
  
  // Full page overlay spinner with backdrop
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50 flex items-center justify-center">
        <div className={`relative ${sizeClasses}`}>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
          <div className="absolute inset-1 rounded-full border-4 border-transparent border-t-primary-300 animate-spin" style={{ animationDirection: 'reverse' }}></div>
        </div>
      </div>
    );
  }
  
  // Regular inline spinner
  return (
    <div className="flex items-center justify-center p-4">
      <div className={`relative ${sizeClasses}`}>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
        <div className="absolute inset-1 rounded-full border-4 border-transparent border-t-primary-300 animate-spin" style={{ animationDirection: 'reverse' }}></div>
      </div>
    </div>
  );
};

export default Spinner;
