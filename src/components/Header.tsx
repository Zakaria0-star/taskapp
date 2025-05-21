import React from 'react';
import { Layout, Plus, Search } from 'lucide-react';

interface HeaderProps {
  onAddTask: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddTask }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Layout className="h-8 w-8 text-indigo-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">TaskBoard AI</h1>
          </div>
          
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search tasks..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
              />
            </div>
          </div>
          
          <div>
            <button
              onClick={onAddTask}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;