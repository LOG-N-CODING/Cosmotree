import { hex } from 'framer-motion';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../UI/Logo';

interface HeaderProps {
  mode?: 'light' | 'dark';
  fixed?: boolean | false;
}

const Header = ({ mode = 'light', fixed = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link 
      to={to} 
      className="flex items-center gap-3 px-3 py-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg transition-colors"
      onClick={() => setIsMenuOpen(false)}
    >
      <div className="flex items-center gap-1.5 w-1 h-5">
        <div className="w-0 h-3.5 border-l border-transparent"></div>
        <div className="w-0 h-full border-l border-transparent"></div>
      </div>
      <span className={`text-lg font-gowun leading-tight tracking-tight ${mode === 'light' ? 'text-black' : 'text-white'}`}>
        {children}
      </span>
    </Link>
  );

  return (
    <>
      <nav className={`${fixed ? 'fixed' : ''} top-4 md:top-10 left-4 md:left-10 right-4 md:right-10 z-50 backdrop-blur rounded-xl ${mode === 'light'
        ? 'bg-gray-200 bg-opacity-50'
        : 'bg-black bg-opacity-50 backdrop-blur-lg'
        }`}>
        <div className="flex justify-between items-center py-3 md:py-5 px-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/learn">Learn</NavLink>
            <NavLink to="/quizzes">Quizzes</NavLink>
            <NavLink to="/mypage">My Page</NavLink>
            <NavLink to="/auth/login">Login</NavLink>
            <NavLink to="/auth/signup">Sign Up</NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              className={mode === 'light' ? 'text-black' : 'text-white'}
            >
              {isMenuOpen ? (
                <path 
                  d="M18 6L6 18M6 6L18 18" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              ) : (
                <path 
                  d="M3 12H21M3 6H21M3 18H21" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Offcanvas Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Offcanvas Menu */}
          <div className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] z-50 lg:hidden transform transition-transform duration-300 ${
            mode === 'light' 
              ? 'bg-white border-l border-gray-200' 
              : 'bg-gray-900 border-l border-gray-700'
            }`}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <Logo />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    className={mode === 'light' ? 'text-black' : 'text-white'}
                  >
                    <path 
                      d="M18 6L6 18M6 6L18 18" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col p-4 space-y-2">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/learn">Learn</NavLink>
                <NavLink to="/quizzes">Quizzes</NavLink>
                <NavLink to="/mypage">My Page</NavLink>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <NavLink to="/auth/login">Login</NavLink>
                  <NavLink to="/auth/signup">Sign Up</NavLink>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
