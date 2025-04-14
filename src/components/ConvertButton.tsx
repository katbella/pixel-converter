import React from "react";

interface ConvertButtonProps {
  files: File[];
  onConvert: () => void;
  progress: number | null;
}

const ConvertButton: React.FC<ConvertButtonProps> = ({
  files,
  onConvert,
  progress,
}) => {
  const label =
    files.length === 1
      ? "Convert 1 file"
      : files.length > 1
        ? `Convert ${files.length} files`
        : "Add files to convert";

  return progress === null ? (
    <button
      className="w-full mt-4 bg-cyan-600 dark:bg-cyan-700 hover:bg-cyan-500 dark:hover:bg-cyan-600
    disabled:bg-neutral-400 dark:disabled:bg-neutral-600 text-white font-semibold py-2 rounded transition
    focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:ring-offset-2
    dark:focus:ring-offset-neutral-900"
      onClick={onConvert}
      disabled={files.length === 0}
      aria-label={label}
    >
      {label}
    </button>
  ) : (
    <div
      className="space-y-1"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded">
        <div
          className="bg-cyan-600 dark:bg-cyan-500 h-2 rounded transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p
        className="text-xs text-right text-neutral-500 dark:text-neutral-400"
        aria-live="polite"
      >
        {progress}%
      </p>
    </div>
  );
};

export default ConvertButton;
