import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListChecks, BarChart2, Calendar, Settings, Menu, X } from 'lucide-react';
import { useAtom } from 'jotai';
import { themeAtom } from '../../store/userStore';
import Button from '../common/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [theme] = useAtom(themeAtom);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getActiveLinkClass = (path: string) => {
    return location.pathname === path
      ? 'text-primary-600 font-bold'
      : 'text-gray-600 hover:text-primary-600';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 space-x-reverse">
              <ListChecks className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">مدیریت وظایف</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link to="/" className={`flex items-center space-x-1 space-x-reverse ${getActiveLinkClass('/')}`}>
              <ListChecks className="h-5 w-5" />
              <span>وظایف</span>
            </Link>
            <Link to="/calendar" className={`flex items-center space-x-1 space-x-reverse ${getActiveLinkClass('/calendar')}`}>
              <Calendar className="h-5 w-5" />
              <span>تقویم</span>
            </Link>
            <Link to="/stats" className={`flex items-center space-x-1 space-x-reverse ${getActiveLinkClass('/stats')}`}>
              <BarChart2 className="h-5 w-5" />
              <span>آمار</span>
            </Link>
            <Link to="/settings" className={`flex items-center space-x-1 space-x-reverse ${getActiveLinkClass('/settings')}`}>
              <Settings className="h-5 w-5" />
              <span>تنظیمات</span>
            </Link>
          </nav>

          {/* Profile/Login Button */}
          <div className="hidden md:block">
            <Button variant="primary" size="sm">
              پروفایل کاربری
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600 hover:text-primary-600 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-3">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`flex items-center space-x-2 space-x-reverse p-2 rounded-lg ${getActiveLinkClass('/')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <ListChecks className="h-5 w-5" />
                <span>وظایف</span>
              </Link>
              <Link 
                to="/calendar" 
                className={`flex items-center space-x-2 space-x-reverse p-2 rounded-lg ${getActiveLinkClass('/calendar')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar className="h-5 w-5" />
                <span>تقویم</span>
              </Link>
              <Link 
                to="/stats" 
                className={`flex items-center space-x-2 space-x-reverse p-2 rounded-lg ${getActiveLinkClass('/stats')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart2 className="h-5 w-5" />
                <span>آمار</span>
              </Link>
              <Link 
                to="/settings" 
                className={`flex items-center space-x-2 space-x-reverse p-2 rounded-lg ${getActiveLinkClass('/settings')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>تنظیمات</span>
              </Link>
              <Button variant="primary" size="sm" className="w-full">
                پروفایل کاربری
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;