import React, { useState } from 'react';
import { format } from 'date-fns';
import { Draggable } from '@hello-pangea/dnd';
import { Edit, Trash2, AlarmClock, Calendar } from 'lucide-react';
import { Task } from '../types';
import { useBoard } from '../context/BoardContext';
import TaskForm from './TaskForm';

interface TaskCardProps {
  task: Task;
  index: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteTask } = useBoard();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isDeadlinePassed = () => {
    const deadlineDate = new Date(task.deadline);
    const currentDate = new Date();
    return deadlineDate < currentDate && task.column !== 'completed';
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (isEditing) {
    return <TaskForm task={task} onClose={() => setIsEditing(false)} />;
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 p-4 rounded-lg shadow-sm border border-gray-200 bg-white hover:shadow-md transition-all duration-200 ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-indigo-200' : ''
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900 flex-1 break-words">{task.title}</h3>
            <div className="flex gap-1 ml-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
                aria-label="Edit task"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                aria-label="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 break-words">{task.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            
            <div className={`flex items-center text-xs px-2 py-1 rounded-full border ${
              isDeadlinePassed() 
                ? 'bg-red-100 text-red-800 border-red-200' 
                : 'bg-blue-100 text-blue-800 border-blue-200'
            }`}>
              <Calendar size={12} className="mr-1" />
              {formatDate(task.deadline)}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;