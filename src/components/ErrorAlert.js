import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const ErrorAlert = ({ message, onClose }) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;