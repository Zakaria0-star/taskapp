import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BoardState, Task, ColumnType, Priority } from '../types';

interface BoardContextProps {
  state: BoardState;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'column'>) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, sourceColumn: ColumnType, destinationColumn: ColumnType, index: number) => void;
  suggestTaskInfo: (description: string) => Promise<{ title: string; priority: Priority }>;
}

const initialState: BoardState = {
  tasks: {},
  columns: {
    todo: {
      id: 'todo',
      title: 'To Do',
      taskIds: [],
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      taskIds: [],
    },
    completed: {
      id: 'completed',
      title: 'Completed',
      taskIds: [],
    },
  },
  columnOrder: ['todo', 'inProgress', 'completed'],
};

type BoardAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { taskId: string; updatedTask: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: { taskId: string } }
  | { type: 'MOVE_TASK'; payload: { taskId: string; sourceColumn: ColumnType; destinationColumn: ColumnType; index: number } }
  | { type: 'SET_BOARD'; payload: BoardState };

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'ADD_TASK': {
      const { id, column } = action.payload;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [id]: action.payload,
        },
        columns: {
          ...state.columns,
          [column]: {
            ...state.columns[column],
            taskIds: [...state.columns[column].taskIds, id],
          },
        },
      };
    }
    case 'UPDATE_TASK': {
      const { taskId, updatedTask } = action.payload;
      const oldTask = state.tasks[taskId];
      const newTask = { ...oldTask, ...updatedTask };

      // If the column has changed, update the taskIds arrays
      if (updatedTask.column && updatedTask.column !== oldTask.column) {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            [taskId]: newTask,
          },
          columns: {
            ...state.columns,
            [oldTask.column]: {
              ...state.columns[oldTask.column],
              taskIds: state.columns[oldTask.column].taskIds.filter(id => id !== taskId),
            },
            [updatedTask.column]: {
              ...state.columns[updatedTask.column],
              taskIds: [...state.columns[updatedTask.column].taskIds, taskId],
            },
          },
        };
      }

      // If column hasn't changed, just update the task
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: newTask,
        },
      };
    }
    case 'DELETE_TASK': {
      const { taskId } = action.payload;
      const column = state.tasks[taskId].column;
      const { [taskId]: _, ...restTasks } = state.tasks;

      return {
        ...state,
        tasks: restTasks,
        columns: {
          ...state.columns,
          [column]: {
            ...state.columns[column],
            taskIds: state.columns[column].taskIds.filter(id => id !== taskId),
          },
        },
      };
    }
    case 'MOVE_TASK': {
      const { taskId, sourceColumn, destinationColumn, index } = action.payload;

      // If moving within the same column
      if (sourceColumn === destinationColumn) {
        const newTaskIds = Array.from(state.columns[sourceColumn].taskIds);
        newTaskIds.splice(newTaskIds.indexOf(taskId), 1);
        newTaskIds.splice(index, 0, taskId);

        return {
          ...state,
          columns: {
            ...state.columns,
            [sourceColumn]: {
              ...state.columns[sourceColumn],
              taskIds: newTaskIds,
            },
          },
        };
      }

      // Moving between columns
      const sourceTaskIds = Array.from(state.columns[sourceColumn].taskIds);
      sourceTaskIds.splice(sourceTaskIds.indexOf(taskId), 1);

      const destinationTaskIds = Array.from(state.columns[destinationColumn].taskIds);
      destinationTaskIds.splice(index, 0, taskId);

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            column: destinationColumn,
          },
        },
        columns: {
          ...state.columns,
          [sourceColumn]: {
            ...state.columns[sourceColumn],
            taskIds: sourceTaskIds,
          },
          [destinationColumn]: {
            ...state.columns[destinationColumn],
            taskIds: destinationTaskIds,
          },
        },
      };
    }
    case 'SET_BOARD':
      return action.payload;
    default:
      return state;
  }
}

const BoardContext = createContext<BoardContextProps | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('taskboardState');
    if (savedState) {
      dispatch({ type: 'SET_BOARD', payload: JSON.parse(savedState) });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('taskboardState', JSON.stringify(state));
  }, [state]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'column'>) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      column: 'todo', // New tasks always start in the "To Do" column
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (taskId: string, updatedTask: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { taskId, updatedTask } });
  };

  const deleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { taskId } });
  };

  const moveTask = (
    taskId: string,
    sourceColumn: ColumnType,
    destinationColumn: ColumnType,
    index: number
  ) => {
    dispatch({
      type: 'MOVE_TASK',
      payload: { taskId, sourceColumn, destinationColumn, index },
    });
  };

  // Simulate AI suggestion functionality
  const suggestTaskInfo = async (description: string): Promise<{ title: string; priority: Priority }> => {
    // In a real app, this would call an AI API like OpenAI
    // For demo purposes, we'll implement a simple algorithm

    // Simple priority determination based on keyword analysis
    let priority: Priority = 'medium';
    const lowPriorityKeywords = ['someday', 'eventually', 'when possible', 'low priority'];
    const highPriorityKeywords = ['urgent', 'asap', 'immediately', 'critical', 'important'];
    
    if (lowPriorityKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      priority = 'low';
    } else if (highPriorityKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      priority = 'high';
    }

    // Simple title generation - take first 5-8 words
    const words = description.split(' ');
    const titleLength = Math.min(Math.max(5, Math.floor(words.length / 3)), 8);
    const title = words.slice(0, titleLength).join(' ');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    return { title, priority };
  };

  return (
    <BoardContext.Provider value={{ state, addTask, updateTask, deleteTask, moveTask, suggestTaskInfo }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = (): BoardContextProps => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};