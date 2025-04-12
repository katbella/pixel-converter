import React, { useEffect, useRef, useState } from "react";
import type { IpcRendererEvent } from "electron";
import "./App.css";

const SUPPORTED_OUTPUTS = ["jpg", "png", "webp", "avif", "tiff", "gif"];

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState<string>("jpg");
  const [outputDir, setOutputDir] = useState<string | null>(null);
  const [shouldShowOutputDir, setShouldShowOutputDir] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [conversionStatus, setConversionStatus] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function addUniqueImageFiles(currentFiles: File[], newFiles: File[]): File[] {
    const allowedExtensions = new Set([
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".avif",
      ".tiff",
      ".tif",
      ".gif",
      ".heic",
      ".heif",
    ]);

    const existingPaths = new Set(currentFiles.map((f) => f.path));

    const isImage = (file: File) => {
      const ext = file.name.toLowerCase().split(".").pop();
      return ext ? allowedExtensions.has(`.${ext}`) : false;
    };

    const uniqueValidImages = newFiles.filter(
      (f) => isImage(f) && !existingPaths.has(f.path),
    );

    return [...currentFiles, ...uniqueValidImages];
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    setFiles((prevFiles) => addUniqueImageFiles(prevFiles, droppedFiles));
    setConversionStatus(null);
    setProgress(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevFiles) => addUniqueImageFiles(prevFiles, selectedFiles));
      setConversionStatus(null);
      setProgress(null);
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    const paths = files.map((file) => file.path);

    const convertedPaths = await window.ipcRenderer.invoke("convert-images", {
      paths,
      outputFormat,
      outputDir,
    });

    setConversionStatus(`✅ Converted ${convertedPaths.length} file(s)!`);

    if (shouldShowOutputDir && outputDir) {
      await window.ipcRenderer.invoke("open-folder", outputDir);
    }

    // Reset everything after conversion
    setFiles([]);
    setOutputDir(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setProgress(null);
  };

  useEffect(() => {
    const listener = (_event: IpcRendererEvent, percent: number) => {
      setProgress(percent);
    };
    window.ipcRenderer.on("conversion-progress", listener);

    return () => {
      window.ipcRenderer.off("conversion-progress", listener);
    };
  }, []);

  const convertButtonLabel = () => {
    if (files.length === 1) {
      return "Convert 1 file";
    } else if (files.length > 1) {
      return `Convert ${files.length} files`;
    }
    return "Add files to convert";
  };

  return (
    <div
      className="w-[400px] mx-auto bg-neutral-900 text-white p-6 space-y-4"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        setIsDragging(false);
        handleDrop(e);
      }}
    >
      <h1 className="text-2xl font-semibold text-center">Pixel Converter</h1>
      <p className="text-center text-neutral-400 text-sm">
        Drag and drop images here to convert them.
      </p>

      <label
        htmlFor="file-upload"
        className={`mt-4 flex flex-col items-center justify-center border-2 border-dashed rounded-lg px-4 py-8 text-neutral-400 cursor-pointer transition ${
          isDragging ? "border-cyan-400 bg-neutral-800" : "border-neutral-700"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0-8l-3 3m3-3l3 3m-3-10V4m0 0L9 7m3-3l3 3"
          />
        </svg>
        <span className="font-medium text-cyan-500">Choose Files</span>
        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      <div className="text-sm text-center">
        {files.length > 0
          ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
          : "No file selected"}
        {files.length > 0 && (
          <button
            className="ml-2 text-red-400 hover:underline"
            onClick={() => {
              setFiles([]);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>Output format</span>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="bg-neutral-800 text-white border border-neutral-600 rounded px-2 py-1"
          >
            {SUPPORTED_OUTPUTS.map((format) => (
              <option key={format} value={format}>
                {format.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm">
          <div className="flex justify-between items-center">
            <span>Output folder</span>
            <button
              className="text-cyan-400 hover:underline text-sm"
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
            <div className="mt-1 text-xs text-neutral-300 truncate">
              {outputDir}
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={shouldShowOutputDir}
            onChange={(e) => setShouldShowOutputDir(e.target.checked)}
            className="accent-cyan-500"
          />
          Open folder after conversion
        </label>
      </div>

      {progress === null ? (
        <button
          className="w-full mt-4 bg-cyan-700 hover:bg-cyan-600 disabled:bg-neutral-600 text-white font-semibold py-2 rounded transition"
          onClick={handleConvert}
          disabled={files.length === 0}
        >
          {convertButtonLabel()}
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
      )}

      {conversionStatus && (
        <p className="text-xs text-neutral-300 text-center mt-2">
          {conversionStatus}
        </p>
      )}

      <div className="flex justify-between items-center mt-4 text-sm">
        <button
          onClick={() => setShowAbout(true)}
          className="text-cyan-500 hover:underline"
        >
          About
        </button>
        <button
          onClick={() =>
            window.ipcRenderer.invoke(
              "open-external-url",
              "https://your-kofi-or-placeholder.com",
            )
          }
          className="text-cyan-400 hover:underline"
        >
          Buy me a coffee
        </button>
      </div>

      {showAbout && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => setShowAbout(false)}
        >
          <div
            className="bg-neutral-800 text-white p-6 rounded shadow-xl max-w-sm space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">About</h2>
            <p className="text-sm">Version 1.0.0</p>
            <p className="text-sm">
              Pixel Converter is a lightweight image converter made with love,
              but mostly made because I got tired of dealing with HEIC files.
              Drop images, choose a format, and convert.
            </p>
            <button
              onClick={() => setShowAbout(false)}
              className="bg-neutral-700 hover:bg-neutral-600 rounded px-4 py-1 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
