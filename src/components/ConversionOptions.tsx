import React from "react";

interface ConversionOptionsProps {
  outputFormat: string;
  setOutputFormat: (format: string) => void;
  outputDir: string | null;
  setOutputDir: (path: string) => void;
  shouldShowOutputDir: boolean;
  setShouldShowOutputDir: (value: boolean) => void;
  supportedFormats: string[];
}

const ConversionOptions: React.FC<ConversionOptionsProps> = ({
  outputFormat,
  setOutputFormat,
  outputDir,
  setOutputDir,
  shouldShowOutputDir,
  setShouldShowOutputDir,
  supportedFormats,
}) => {
  return (
    <div className="space-y-2 text-sm text-neutral-900 dark:text-white">
      <div className="flex justify-between items-center">
        <span>Output format</span>
        <select
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
          className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-600 rounded px-2 py-1"
        >
          {supportedFormats.map((format) => (
            <option key={format} value={format}>
              {format.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <span>Output folder</span>
          <button
            className="text-cyan-600 dark:text-cyan-400 hover:underline"
            onClick={async () => {
              const selected = await window.ipcRenderer.invoke(
                "select-output-folder",
              );
              if (selected) {
                setOutputDir(selected);
              }
            }}
          >
            Choose
          </button>
        </div>
        {outputDir && (
          <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-300 truncate">
            {outputDir}
          </div>
        )}
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={shouldShowOutputDir}
          onChange={(e) => setShouldShowOutputDir(e.target.checked)}
          className="accent-cyan-500"
        />
        Open folder after conversion
      </label>
    </div>
  );
};

export default ConversionOptions;
