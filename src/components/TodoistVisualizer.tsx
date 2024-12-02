import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ErrorBoundary } from './ErrorBoundary';
import { handleTodoistError, validateTaskSelection, validateFilterSelection, logError } from '../utils/errorHandling';

interface TodoistVisualizerProps {
  apiToken: string;
}

export const TodoistVisualizer: React.FC<TodoistVisualizerProps> = ({ apiToken }) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!apiToken) {
          throw new Error('API token is required');
        }

        const response = await fetch('https://api.todoist.com/rest/v2/tasks', {
          headers: {
            'Authorization': `Bearer ${apiToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTasks(data);
      } catch (err: any) {
        const handledError = handleTodoistError(err);
        logError(handledError, 'FETCH_TASKS');
        setError(handledError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [apiToken]);

  const handleTaskSelect = (taskId: string) => {
    try {
      validateTaskSelection(taskId);
      setSelectedTask(taskId);
      setError(null);
    } catch (err: any) {
      logError(err, 'TASK_SELECTION');
      setError(err);
    }
  };

  const handleFilterSelect = (filter: string) => {
    try {
      validateFilterSelection(filter);
      setSelectedFilter(filter);
      setError(null);
    } catch (err: any) {
      logError(err, 'FILTER_SELECTION');
      setError(err);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-4">
        {/* Task selection UI */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Select Task</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedTask === task.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleTaskSelect(task.id)}
              >
                {task.content}
              </div>
            ))}
          </div>
        </div>

        {/* Filter selection UI */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Select Filter</h2>
          <div className="flex gap-4">
            {['today', 'upcoming', 'completed'].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-lg ${
                  selectedFilter === filter
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
                onClick={() => handleFilterSelect(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Visualization placeholder */}
        {selectedTask && selectedFilter && (
          <div className="mt-4">
            <img
              src="/api/placeholder/600/400"
              alt="Task visualization placeholder"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};