import React from "react";

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-neutral-800 text-white p-6 rounded shadow-xl max-w-sm space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold">About</h2>
        <p className="text-sm">Version 1.0.0</p>
        <p className="text-sm">
          Pixel Converter is a lightweight image converter. Drop images, choose
          a format, and convert!
        </p>
        <button
          onClick={onClose}
          className="bg-neutral-700 hover:bg-neutral-600 rounded px-4 py-1 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AboutModal;
