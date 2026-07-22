import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Rocket } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAdminEdit } from '../context/AdminEditContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Products', path: '/products' },
  { name: 'Startup Studio', path: '/startup-studio' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Careers', path: '/careers' },
  { name: 'Internships', path: '/internships' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
  { name: 'Portal', path: '/portal' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { config, isAdmin } = useAdminEdit();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={`fixed left-0 w-full z-50 transition-all duration-300 ${
      isAdmin ? 'top-12' : 'top-0'
    } ${
      scrolled 
        ? 'glass shadow-lg py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-400 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
              <Rocket className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-primary-800 dark:from-white dark:to-accent-200 bg-clip-text text-transparent">
              {config?.company?.name || 'ArivTek'}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary-600 dark:text-accent-400 bg-primary-50 dark:bg-primary-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-accent-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Controls */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 animate-spin-slow" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              to="/contact"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium text-sm transition-all duration-300 shadow-md shadow-primary-500/20 hover:scale-[1.02]"
            >
              Partner Us
            </Link>
          </div>

          {/* Mobile Buttons */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200/60 dark:border-slate-800/60 bg-white/95 dark:bg-darkBg/95 backdrop-blur-md"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-primary-600 dark:text-accent-400 bg-primary-50 dark:bg-primary-950/40 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-accent-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-4 px-4">
                <Link
                  to="/contact"
                  className="block w-full py-2.5 text-center rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium text-base transition-all duration-300 shadow-md shadow-primary-500/20"
                >
                  Partner Us
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
