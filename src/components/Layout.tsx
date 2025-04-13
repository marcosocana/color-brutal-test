
import React from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { Menu } from 'lucide-react';
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

  const toggleLanguage = (lang: 'es' | 'en') => {
    setLanguage(lang);
  };

  const LanguageToggle = () => (
    <div className="flex items-center border border-white rounded overflow-hidden">
      <button 
        className={`px-3 py-1 text-sm ${language === 'es' ? 'bg-white text-black font-bold' : 'bg-transparent'}`}
        onClick={() => toggleLanguage('es')}
      >
        ES
      </button>
      <span className="text-white mx-0.5">/</span>
      <button 
        className={`px-3 py-1 text-sm ${language === 'en' ? 'bg-white text-black font-bold' : 'bg-transparent'}`}
        onClick={() => toggleLanguage('en')}
      >
        EN
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col bg-[#333333] text-foreground brutalist-grid ${fullHeight ? 'h-screen overflow-hidden' : ''}`}>
      <header className="border-b border-white py-4 px-6 flex justify-between items-center fixed top-0 left-0 right-0 bg-[#333333] z-50">
        <Link to="/" className="font-display text-xl tracking-tighter uppercase flex items-center">
          <img src={coloreteLogo} alt="Colorete" className="h-8 mr-2" />
          Colorete
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Desktop view: Language toggle + navigation */}
          {!isMobile && (
            <>
              <nav className="flex gap-8">
                <Link to="/manifesto" className="nav-link">
                  {t('manifesto')}
                </Link>
                <Link to="/about" className="nav-link">
                  {t('about')}
                </Link>
              </nav>
              <LanguageToggle />
            </>
          )}
          
          {/* Mobile view: Only hamburger menu */}
          {isMobile && (
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
                    <div className="mt-4">
                      <LanguageToggle />
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
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
