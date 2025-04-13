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
      className="w-full mt-4 bg-cyan-700 hover:bg-cyan-600 disabled:bg-neutral-600 text-white font-semibold py-2 rounded transition"
      onClick={onConvert}
      disabled={files.length === 0}
    >
      {label}
    </button>
  ) : (
    <div className="space-y-1">
      <div className="w-full bg-neutral-700 h-2 rounded">
        <div
          className="bg-cyan-500 h-2 rounded transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-right text-neutral-400">{progress}%</p>
    </div>
  );
};

export default ConvertButton;
