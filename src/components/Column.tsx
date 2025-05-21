import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Task, Column as ColumnType } from '../types';
import { PlusCircle } from 'lucide-react';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: () => void;
}

const getColumnStyle = (columnId: string) => {
  switch (columnId) {
    case 'todo':
      return 'bg-indigo-50 border-indigo-200';
    case 'inProgress':
      return 'bg-amber-50 border-amber-200';
    case 'completed':
      return 'bg-emerald-50 border-emerald-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

const Column: React.FC<ColumnProps> = ({ column, tasks, onAddTask }) => {
  return (
    <div className={`flex flex-col rounded-lg shadow-sm ${getColumnStyle(column.id)} border min-h-[500px] w-full md:w-[300px] lg:w-[320px]`}>
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-black-800">{column.title}</h2>
        <div className="flex items-center">
          <span className="bg-white text-gray-600 text-xs font-medium rounded-full px-2 py-0.5 mr-2">
            {tasks.length}
          </span>
          {column.id === 'todo' && (
            <button
              onClick={onAddTask}
              className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
              aria-label="Add task"
            >
              <PlusCircle size={18} />
            </button>
          )}
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-grow p-3 overflow-y-auto transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-50/50' : ''
              }`}
            style={{ minHeight: '100px' }}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && (
              <div className="flex items-center justify-center h-20 text-gray-400 text-sm border border-dashed border-gray-300 rounded-md">
                No tasks
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;