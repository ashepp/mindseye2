export class TodoistAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'TodoistAPIError';
  }
}

export const handleTodoistError = (error: any): TodoistAPIError => {
  if (error?.response) {
    const status = error.response.status;
    switch (status) {
      case 401:
        return new TodoistAPIError('Authentication failed. Please check your API token.', status, 'AUTH_FAILED');
      case 403:
        return new TodoistAPIError('Access forbidden. Please check your permissions.', status, 'ACCESS_FORBIDDEN');
      case 429:
        return new TodoistAPIError('Rate limit exceeded. Please try again later.', status, 'RATE_LIMIT');
      default:
        return new TodoistAPIError(`API request failed with status ${status}`, status, 'API_ERROR');
    }
  }
  if (error?.request) {
    return new TodoistAPIError('No response received from Todoist API. Please check your connection.', undefined, 'NO_RESPONSE');
  }
  return new TodoistAPIError(error?.message || 'An unexpected error occurred', undefined, 'UNKNOWN_ERROR');
};

export const validateTaskSelection = (taskId: string | null): void => {
  if (!taskId) {
    throw new Error('No task selected');
  }
  if (typeof taskId !== 'string') {
    throw new Error('Invalid task selection');
  }
};

export const validateFilterSelection = (filter: string | null): void => {
  if (!filter) {
    throw new Error('No filter selected');
  }
  if (typeof filter !== 'string') {
    throw new Error('Invalid filter selection');
  }
};

export const logError = (error: Error, context?: string): void => {
  console.error(`[${context || 'ERROR'}]`, {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
};