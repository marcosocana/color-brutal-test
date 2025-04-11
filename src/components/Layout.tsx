
import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  fullHeight?: boolean;
}

const Layout = ({ children, fullHeight = true }: LayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${fullHeight ? 'h-screen overflow-hidden' : ''}`}>
      <header className="border-b border-white py-4 px-6 flex justify-between items-center">
        <Link to="/" className="font-display text-xl tracking-tighter uppercase">Colorete</Link>
        <nav className="flex gap-8">
          <Link to="/manifesto" className="nav-link">Manifesto</Link>
          <Link to="/about" className="nav-link">About</Link>
        </nav>
      </header>
      <main className="flex-grow flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default Layout;
