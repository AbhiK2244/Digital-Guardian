import React from 'react';
import { Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Digital Guardian</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering users worldwide with digital literacy and online safety education 
              through interactive learning and real-time protection tools.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400" />
              <span>for global digital safety</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Learn</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Phishing Awareness</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Social Media Safety</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Data Protection</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Digital Footprint</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Tools</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">URL Checker</a></li>
              <li><a href="#" className="hover:text-white transition-colors">News Verification</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Spam Detector</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Breach Scanner</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Digital Guardian. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};