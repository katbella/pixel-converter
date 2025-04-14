import React, { ReactNode } from "react";

interface StatusMessageProps {
  message: ReactNode | null;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <p
      className="text-xs text-neutral-600 dark:text-neutral-300 text-center mt-2"
      role="status"
      aria-live="polite"
    >
      {message}
    </p>
  );
};

export default StatusMessage;
