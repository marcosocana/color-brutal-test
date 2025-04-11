
import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-white py-4 px-6 flex justify-between items-center">
        <Link to="/" className="font-display text-xl tracking-tighter uppercase">Color Brutal</Link>
        <nav className="flex gap-8">
          <Link to="/manifesto" className="nav-link">Manifesto</Link>
          <Link to="/about" className="nav-link">About</Link>
        </nav>
      </header>
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <div className="noise-filter"></div>
    </div>
  );
};

export default Layout;
