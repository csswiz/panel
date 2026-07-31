import React, { createContext, useContext, useState, useEffect } from 'react';

const CommandPaletteContext = createContext();

export const CommandPaletteProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openPalette = () => setIsOpen(true);
  const closePalette = () => setIsOpen(false);
  const togglePalette = () => setIsOpen(prev => !prev);

  return (
    <CommandPaletteContext.Provider value={{ isOpen, openPalette, closePalette, togglePalette }}>
      {children}
    </CommandPaletteContext.Provider>
  );
};

export const useCommandPalette = () => {
  const context = useContext(CommandPaletteContext);
  if (!context) throw new Error('useCommandPalette must be used within CommandPaletteProvider');
  return context;
};
