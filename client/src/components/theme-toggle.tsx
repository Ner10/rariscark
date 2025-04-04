import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { playClickSound } from '@/lib/confetti';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // On mount, check if the user has a preferred theme
  useEffect(() => {
    const isDark = localStorage.getItem('wheelTheme') === 'dark' || 
                   (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  const toggleTheme = () => {
    playClickSound();
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    applyTheme(newMode);
    localStorage.setItem('wheelTheme', newMode ? 'dark' : 'light');
  };

  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#1a1a2e';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
  };

  return (
    <button 
      className={`theme-toggle ${className} ${isDarkMode ? 'bg-gray-800 text-yellow-300' : 'bg-white text-gray-800'}`}
      onClick={toggleTheme}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Sun size={24} />
      ) : (
        <Moon size={24} />
      )}
    </button>
  );
};

export default ThemeToggle;