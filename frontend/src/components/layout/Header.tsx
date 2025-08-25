import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, User, Menu, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Badge } from '../ui/Badge';
import { useState } from 'react';

export const Header: React.FC = () => {
  const { state } = useApp();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Detection Tool', href: '/detect' },
    { name: 'Local News', href: '/local-news' },
    { name: 'Breach Check', href: '/breach-check' },
    { name: 'Quiz', href: '/quiz' },
    { name: 'Dashboard', href: '/dashboard' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Digital Guardian</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="hidden md:flex items-center space-x-4">
            {state.user && (
              <>
                <div className="flex items-center space-x-2">
                  <Badge variant="info">{state.user.points} pts</Badge>
                  <Badge variant="success">{state.user.level}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-6 w-6 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {state.user.name}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {state.user && (
              <div className="pt-4 border-t border-gray-200">
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {state.user.name}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="info" size="sm">{state.user.points} pts</Badge>
                    <Badge variant="success" size="sm">{state.user.level}</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};