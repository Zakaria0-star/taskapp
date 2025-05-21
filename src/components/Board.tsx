import React, { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import Column from './Column';
import TaskForm from './TaskForm';
import { useBoard } from '../context/BoardContext';

const Board: React.FC = () => {
  const { state, moveTask } = useBoard();
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area or in the same position
    if (!destination ||
      (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    moveTask(
      draggableId,
      source.droppableId as any,
      destination.droppableId as any,
      destination.index
    );
  };

  return (
    <div className="flex-1 p-4 flex flex-col">
      {showTaskForm && (
        <div className="mb-4">
          <TaskForm onClose={() => setShowTaskForm(false)} />
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
          {state.columnOrder.map(columnId => {
            const column = state.columns[columnId];
            const tasks = column.taskIds.map(taskId => state.tasks[taskId]);

            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                onAddTask={() => setShowTaskForm(true)}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;