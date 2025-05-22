import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task, Priority } from '../types';
import { useBoard } from '../context/BoardContext';

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { addTask, updateTask, suggestTaskInfo } = useBoard();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    deadline: string;
    priority: Priority;
  }>({
    title: task?.title || '',
    description: task?.description || '',
    deadline: task?.deadline ? task.deadline.split('T')[0] : '',
    priority: task?.priority || 'medium',
  });

  const [aiSuggestionEnabled, setAiSuggestionEnabled] = useState(false);

  // Set default deadline to tomorrow if creating a new task
  useEffect(() => {
    if (!task) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData(prev => ({
        ...prev,
        deadline: tomorrow.toISOString().split('T')[0],
      }));
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSuggestFromAI = async () => {
    if (!formData.description) return;

    setIsLoading(true);
    try {
      const suggestion = await suggestTaskInfo(formData.description);
      setFormData(prev => ({
        ...prev,
        title: suggestion.title || prev.title,
        priority: suggestion.priority || prev.priority
      }));
    } catch (error) {
      console.error('Error getting AI suggestions', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim() || !formData.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    if (task) {
      // Update existing task
      updateTask(task.id, {
        title: formData.title,
        description: formData.description,
        deadline: new Date(formData.deadline).toISOString(),
        priority: formData.priority,
      });
    } else {
      // Add new task
      addTask({
        title: formData.title,
        description: formData.description,
        deadline: new Date(formData.deadline).toISOString(),
        priority: formData.priority,
      });
    }

    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {task ? 'Edit Task' : 'Create New ask'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {!task && (
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="aiSuggestion"
                checked={aiSuggestionEnabled}
                onChange={() => setAiSuggestionEnabled(!aiSuggestionEnabled)}
                className="mr-2 h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="aiSuggestion" className="text-sm text-gray-600">
                Enable AI suggestions
              </label>
              {aiSuggestionEnabled && (
                <button
                  type="button"
                  disabled={isLoading || !formData.description}
                  onClick={handleSuggestFromAI}
                  className="ml-auto text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Thinking...' : 'Suggest Title & Priority'}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Deadline *
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              required
              value={formData.deadline}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="low">Low</option>
              <option value="medium">chafai</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;