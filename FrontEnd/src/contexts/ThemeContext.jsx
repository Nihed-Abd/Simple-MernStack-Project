import { createContext, useState, useEffect } from 'react';

// Create context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check if user has previously selected a theme from localStorage
  const storedTheme = localStorage.getItem('teamtask_theme');
  
  // Check if system prefers dark mode
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme based on previous preference or system preference
  const [theme, setTheme] = useState(storedTheme || (prefersDarkMode ? 'dark' : 'light'));

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('teamtask_theme', newTheme);
  };

  // Apply theme class to html element when theme changes (for Tailwind dark mode)
  useEffect(() => {
    // For Tailwind, we need to add the 'dark' class to the html element for dark mode
    const htmlElement = document.documentElement;
    
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    
    // Store theme preference
    localStorage.setItem('teamtask_theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
