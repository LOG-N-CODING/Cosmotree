import { Link } from 'react-router-dom';

interface LogoProps {
  mode?: 'light' | 'dark';
}

const Logo = ({ mode = 'light' }: LogoProps) => {
  return (
    <Link to="/" className="flex items-center gap-3">
      {/* <img 
        src={mode === 'dark' ? "/images/logo-dark.png" : "/images/logo.png"} 
        alt="Cosmotree Logo" 
        className="h-10 rounded-lg" 
      /> */}
      <span className={`text-2xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>Cosmotree</span>
    </Link>
  );
};

export default Logo;
