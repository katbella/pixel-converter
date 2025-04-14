import React from "react";

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white p-6 rounded shadow-xl max-w-sm space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-xl font-bold">
          About
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Version 1.0.0
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Pixel Converter is a lightweight image converter. Drop images, choose
          a format, and convert!
        </p>
        <button
          onClick={onClose}
          className="bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600
            rounded px-4 py-1 text-sm transition focus:outline-none focus:ring-2
            focus:ring-cyan-500 dark:focus:ring-cyan-400"
          aria-label="Close modal"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AboutModal;
