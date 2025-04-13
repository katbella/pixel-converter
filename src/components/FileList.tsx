import React from "react";

interface FileListProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FileList = ({ files, setFiles, fileInputRef }: FileListProps) => {
  const handleClear = () => {
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="text-sm text-center">
      {files.length > 0
        ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
        : "No file selected"}
      {files.length > 0 && (
        <button
          className="ml-2 text-red-400 hover:underline"
          onClick={handleClear}
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default FileList;
