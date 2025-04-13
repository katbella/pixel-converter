import React, { ReactNode } from "react";

interface StatusMessageProps {
  message: ReactNode | null;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => {
  if (!message) return null;

  return <p className="text-xs text-neutral-300 text-center mt-2">{message}</p>;
};

export default StatusMessage;
