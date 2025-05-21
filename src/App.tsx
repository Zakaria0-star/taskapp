import React, { useState } from 'react';
import Header from './components/Header';
import Board from './components/Board';
import Footer from './components/Footer';
import TaskForm from './components/TaskForm';
import { BoardProvider } from './context/BoardContext';

function App() {
  const [showTaskForm, setShowTaskForm] = useState(false);

  return (
    <BoardProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header onAddTask={() => setShowTaskForm(true)} />
        
        <main className="flex-1 max-w-7xl w-full mx-auto flex flex-col">
          {showTaskForm && (
            <div className="p-4">
              <TaskForm onClose={() => setShowTaskForm(false)} />
            </div>
          )}
          <Board />
        </main>
        
        <Footer />
      </div>
    </BoardProvider>
  );
}

export default App;