import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import "./App.css";
const SUPPORTED_OUTPUTS = ["jpg", "png", "webp", "avif", "tiff", "gif"];
function App() {
  const [files, setFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState("jpg");
  const [outputDir, setOutputDir] = useState(null);
  const [shouldShowOutputDir, setShouldShowOutputDir] = useState(false);
  const [progress, setProgress] = useState(null);
  const [conversionStatus, setConversionStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const fileInputRef = useRef(null);
  function addUniqueImageFiles(currentFiles, newFiles) {
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
    const isImage = (file) => {
      const ext = file.name.toLowerCase().split(".").pop();
      return ext ? allowedExtensions.has(`.${ext}`) : false;
    };
    const uniqueValidImages = newFiles.filter(
      (f) => isImage(f) && !existingPaths.has(f.path),
    );
    return [...currentFiles, ...uniqueValidImages];
  }
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => addUniqueImageFiles(prevFiles, droppedFiles));
    setConversionStatus(null);
    setProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleFileChange = (e) => {
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
    const listener = (_event, percent) => {
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
  return _jsxs("div", {
    className: "converter-container",
    onDragOver: (e) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: () => setIsDragging(false),
    onDrop: (e) => {
      setIsDragging(false);
      handleDrop(e);
    },
    children: [
      _jsxs("div", {
        className: "header",
        children: [
          _jsx("h1", {
            className: "app-title",
            children: "\uD83D\uDC36 Pixel File Converter",
          }),
          _jsxs("div", {
            className: "header-links",
            children: [
              _jsx("button", {
                className: "link-button",
                onClick: () => setShowAbout(true),
                children: "About",
              }),
              _jsx("button", {
                className: "link-button",
                onClick: () =>
                  window.ipcRenderer.invoke(
                    "open-external-url",
                    "https://your-kofi-or-placeholder.com",
                  ),
                children: "Donate",
              }),
            ],
          }),
        ],
      }),
      _jsxs("div", {
        className: `dropzone ${isDragging ? "dragging" : ""}`,
        children: [
          _jsx("p", { children: "Drag and drop images here" }),
          _jsx("p", { children: "or" }),
          _jsxs("div", {
            className: "file-picker",
            children: [
              _jsx("label", {
                htmlFor: "file-upload",
                className: "file-picker-label",
                children: "Choose file(s)",
              }),
              _jsx("input", {
                id: "file-upload",
                ref: fileInputRef,
                type: "file",
                accept: "image/*,.heic,.heif",
                multiple: true,
                onChange: handleFileChange,
                className: "file-input-hidden",
              }),
              _jsx("div", {
                className: "file-picker-display",
                children:
                  files.length > 0
                    ? `${files.length} file(s) selected`
                    : "No file selected",
              }),
              files.length > 0 &&
                _jsx("button", {
                  className: "clear-button",
                  onClick: () => {
                    setFiles([]);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  },
                  children: "Clear",
                }),
            ],
          }),
        ],
      }),
      _jsxs("div", {
        className: "format-selector",
        children: [
          _jsx("label", {
            htmlFor: "outputFormat",
            children: "Output format: ",
          }),
          _jsx("select", {
            id: "outputFormat",
            value: outputFormat,
            onChange: (e) => setOutputFormat(e.target.value),
            children: SUPPORTED_OUTPUTS.map((format) =>
              _jsx(
                "option",
                { value: format, children: format.toUpperCase() },
                format,
              ),
            ),
          }),
        ],
      }),
      _jsxs("div", {
        className: "output-folder",
        children: [
          _jsx("button", {
            className: "choose-folder-button",
            onClick: async () => {
              const selected = await window.ipcRenderer.invoke(
                "select-output-folder",
              );
              if (selected) {
                setOutputDir(selected);
              }
            },
            children: "Choose Output Folder",
          }),
          outputDir &&
            _jsxs("div", {
              className: "folder-path",
              children: ["[ ", outputDir, " ]"],
            }),
        ],
      }),
      _jsxs("div", {
        className: "action-row",
        children: [
          progress === null
            ? _jsxs(_Fragment, {
                children: [
                  _jsx("button", {
                    className: "convert-button",
                    onClick: handleConvert,
                    disabled: files.length === 0,
                    children: convertButtonLabel(),
                  }),
                  _jsxs("div", {
                    className: "checkbox-row",
                    children: [
                      _jsx("input", {
                        type: "checkbox",
                        id: "show-output-dir",
                        checked: shouldShowOutputDir,
                        onChange: (e) =>
                          setShouldShowOutputDir(e.target.checked),
                      }),
                      _jsx("label", {
                        htmlFor: "show-output-dir",
                        children: "Open output folder after converting",
                      }),
                    ],
                  }),
                ],
              })
            : _jsxs("div", {
                className: "feedback-area",
                children: [
                  _jsxs("p", { children: [progress, "%"] }),
                  _jsx("div", {
                    className: "progress-bar-wrapper",
                    children: _jsx("div", {
                      className: "progress-bar-fill",
                      style: { width: `${progress}%` },
                    }),
                  }),
                ],
              }),
          conversionStatus &&
            _jsx("p", {
              className: "conversion-status",
              children: conversionStatus,
            }),
        ],
      }),
      showAbout &&
        _jsx("div", {
          className: "modal-backdrop",
          onClick: () => setShowAbout(false),
          children: _jsxs("div", {
            className: "modal",
            onClick: (e) => e.stopPropagation(),
            children: [
              _jsx("h2", { children: "About" }),
              _jsx("p", { children: "Version 1.0.0" }),
              _jsx("p", {
                children:
                  "Pixel File Converter is a lightweight image converter made with love, but mostly made because I got tired of dealing with HEIC files. Drop images, choose a format, and convert.",
              }),
              _jsx("button", {
                onClick: () => setShowAbout(false),
                children: "Close",
              }),
            ],
          }),
        }),
    ],
  });
}
export default App;
