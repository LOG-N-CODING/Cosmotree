import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import SignupPage from './pages/Auth/SignupPage';
import LoginPage from './pages/Auth/LoginPage';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import LearnDetail from './pages/Learn/Detail';
import Quizzes from './pages/Quizzes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes without header/footer */}
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        
        {/* Dashboard route without header/footer */}
        <Route path="/dashboard" element={
          <>
            <div className="px-10 pt-10 space-y-8">
              <Header mode='dark' fixed={false} />
            </div>
            <Dashboard />
          </>
        } />

        {/* Learn route with header only */}
        <Route path="/learn" element={
          <>
            <div className="px-10 pt-10 space-y-8">
              <Header mode='dark' fixed={false} />
            </div>
            <Learn />
          </>
        } />

        {/* Learn Detail route with header only */}
        <Route path="/learn/:moduleId" element={<LearnDetail />} />

        {/* Quizzes route with header only */}
        <Route path="/quizzes" element={
            <>
            <div className="px-10 pt-10 space-y-8">
              <Header mode='dark' fixed={false} />
            </div>
            <Learn />
          </>
        } />

        {/* Home route with header and footer */}
        <Route path="/" element={
          <>
            <Header mode='light' fixed={true} />
            <Home />
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
