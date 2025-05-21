import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="mb-2 md:mb-0">
            <p>© {new Date().getFullYear()} TaskBoard AI. All rights reserved.</p>
          </div>
          
          <div className="flex items-center">
            <a
              href="#"
              className="text-gray-500 hover:text-indigo-600 transition-colors mr-4"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 transition-colors mr-4"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;