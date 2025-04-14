import React from "react";

interface DropZoneProps {
  isDragging: boolean;
  setIsDragging: (val: boolean) => void;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setProgress: (val: number | null) => void;
  setConversionStatus: (val: string | null) => void;
  addUniqueImageFiles: (curr: File[], next: File[]) => File[];
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const DropZone = ({
  isDragging,
  setIsDragging,
  setFiles,
  setProgress,
  setConversionStatus,
  addUniqueImageFiles,
  fileInputRef,
}: DropZoneProps) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const dropped = Array.from(e.dataTransfer.files);

    setFiles((prev) => addUniqueImageFiles(prev, dropped));
    setProgress(null);
    setConversionStatus(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);

    setFiles((prev) => addUniqueImageFiles(prev, selected));
    setProgress(null);
    setConversionStatus(null);
  };

  return (
    <label
      htmlFor="file-upload"
      className={`mt-4 flex flex-col items-center justify-center border-2 border-dashed rounded-lg px-4 py-8 cursor-pointer transition
        ${
          isDragging
            ? "border-cyan-400 bg-neutral-100 dark:bg-neutral-800"
            : "border-neutral-300 dark:border-neutral-700"
        }
        hover:bg-neutral-100 dark:hover:bg-neutral-800
        text-neutral-600 dark:text-neutral-400`}
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
      <span className="font-medium text-cyan-600 dark:text-cyan-500">
        Choose Files
      </span>
      <input
        id="file-upload"
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        multiple
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
};

export default DropZone;
