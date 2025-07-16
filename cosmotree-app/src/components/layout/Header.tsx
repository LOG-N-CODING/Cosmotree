import { hex } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../UI/Logo';

interface HeaderProps {
  mode?: 'light' | 'dark';
  fixed?: boolean | false;
}

const Header = ({ mode = 'light', fixed = false }: HeaderProps) => {
  return (
    <nav className={` ${fixed ? 'fixed' : ''} top-10 left-10 right-10 z-50 backdrop-blur rounded-xl ${mode === 'light'
      ? 'bg-gray-200 bg-opacity-80 border border-gray-228'
      : 'bg-black bg-opacity-80 backdrop-blur-lg'
      }`}>
      <div className="flex justify-center items-center gap-6 py-5 px-4">
        {/* Navigation Items */}
        <Logo />

        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center gap-1.5 w-1 h-5">
            <div className="w-0 h-3.5 border-l border-transparent"></div>
            <div className="w-0 h-full border-l border-transparent"></div>
          </div>
          <span className={`text-lg font-gowun leading-tight tracking-tight ${mode === 'light' ? 'text-black' : 'text-white'}`}>
            Dashboard
          </span>
        </Link>

        <Link to="/learn" className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center gap-1.5 w-1 h-5">
            <div className="w-0 h-3.5 border-l border-transparent"></div>
            <div className="w-0 h-full border-l border-transparent"></div>
          </div>
          <span className={`text-lg font-gowun leading-tight tracking-tight ${mode === 'light' ? 'text-black' : 'text-white'}`}>
            Learn
          </span>
        </Link>

        <Link to="/quizzes" className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center gap-1.5 w-1 h-5">
            <div className="w-0 h-3.5 border-l border-transparent"></div>
            <div className="w-0 h-full border-l border-transparent"></div>
          </div>
          <span className={`text-lg font-gowun leading-tight tracking-tight ${mode === 'light' ? 'text-black' : 'text-white'}`}>
            Quizzes
          </span>
        </Link>

        <Link to="/gallery" className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center gap-1.5 w-1 h-5">
            <div className="w-0 h-3.5 border-l border-transparent"></div>
            <div className="w-0 h-full border-l border-transparent"></div>
          </div>
          <span className={`text-lg font-gowun leading-tight tracking-tight ${mode === 'light' ? 'text-black' : 'text-white'}`}>
            Gallery
          </span>
        </Link>

        <Link to="/mypage" className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center gap-1.5 w-1 h-5">
            <div className="w-0 h-3.5 border-l border-transparent"></div>
            <div className="w-0 h-full border-l border-transparent"></div>
          </div>
          <span className={`text-lg font-gowun leading-tight tracking-tight ${mode === 'light' ? 'text-black' : 'text-white'}`}>
            My Page
          </span>
        </Link>

        <Link to="/auth/login" className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center gap-1.5 w-1 h-5">
            <div className="w-0 h-3.5 border-l border-transparent"></div>
            <div className="w-0 h-full border-l border-transparent"></div>
          </div>
          <span className={`text-lg font-gowun leading-tight tracking-tight ${mode === 'light' ? 'text-black' : 'text-white'}`}>
            Login
          </span>
        </Link>

        <Link to="/auth/signup" className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center gap-1.5 w-1 h-5">
            <div className="w-0 h-3.5 border-l border-transparent"></div>
            <div className="w-0 h-full border-l border-transparent"></div>
          </div>
          <span className={`text-lg font-gowun leading-tight tracking-tight ${mode === 'light' ? 'text-black' : 'text-white'}`}>
            Sign Up
          </span>
        </Link>
      </div>
    </nav>

  );
};

export default Header;
