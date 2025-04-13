
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { Menu, Languages } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useIsMobile } from '../hooks/use-mobile';
import { useLanguage } from '../hooks/use-language';
import coloreteLogo from '../assets/colorete-logo.png';

interface LayoutProps {
  children: React.ReactNode;
  fullHeight?: boolean;
}

const Layout = ({ children, fullHeight = true }: LayoutProps) => {
  const isMobile = useIsMobile();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={`min-h-screen flex flex-col bg-[#333333] text-foreground brutalist-grid ${fullHeight ? 'h-screen overflow-hidden' : ''}`}>
      <header className="border-b border-white py-4 px-6 flex justify-between items-center fixed top-0 left-0 right-0 bg-[#333333] z-50">
        <Link to="/" className="font-display text-xl tracking-tighter uppercase flex items-center">
          <img src={coloreteLogo} alt="Colorete" className="h-8 mr-2" />
          Colorete
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[120px] bg-transparent border-white">
              <div className="flex items-center gap-2">
                <Languages size={16} />
                <SelectValue placeholder={language === 'es' ? 'Español' : 'English'} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
          
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2">
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent>
                <div className="pt-10">
                  <nav className="flex flex-col gap-6 mt-8">
                    <Link to="/manifesto" className="nav-link text-xl">
                      {t('manifesto')}
                    </Link>
                    <Link to="/about" className="nav-link text-xl">
                      {t('about')}
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <nav className="flex gap-8">
              <Link to="/manifesto" className="nav-link">
                {t('manifesto')}
              </Link>
              <Link to="/about" className="nav-link">
                {t('about')}
              </Link>
            </nav>
          )}
        </div>
      </header>
      <main className="flex-grow flex flex-col pt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;
