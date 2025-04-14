import { ReactNode, useEffect, useRef, useState } from "react";
import type { IpcRendererEvent } from "electron";
import DropZone from "./components/DropZone";
import FileList from "./components/FileList";
import ConversionOptions from "./components/ConversionOptions";
import ConvertButton from "./components/ConvertButton";
import StatusMessage from "./components/StatusMessage";
import FooterLinks from "./components/FooterLinks";
import AboutModal from "./components/AboutModal";

const SUPPORTED_OUTPUTS = ["jpg", "png", "webp", "avif", "tiff", "gif"];

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState<string>("jpg");
  const [outputDir, setOutputDir] = useState<string | null>(null);
  const [shouldShowOutputDir, setShouldShowOutputDir] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [conversionStatus, setConversionStatus] = useState<ReactNode | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addUniqueImageFiles = (current: File[], incoming: File[]) => {
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

    const existingPaths = new Set(current.map((f) => f.path));

    return [
      ...current,
      ...incoming.filter((f) => {
        const ext = f.name.toLowerCase().split(".").pop();
        return (
          ext && allowedExtensions.has(`.${ext}`) && !existingPaths.has(f.path)
        );
      }),
    ];
  };

  const handleConvert = async () => {
    if (!files.length) return;

    const paths = files.map((f) => f.path);

    const result = await window.ipcRenderer.invoke("convert-images", {
      paths,
      outputFormat,
      outputDir,
    });

    setConversionStatus(
      <span className="inline-flex items-center gap-1 text-green-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
        </svg>
        Converted {result.length} file{result.length === 1 ? "" : "s"}!
      </span>,
    );

    if (shouldShowOutputDir && outputDir) {
      await window.ipcRenderer.invoke("open-folder", outputDir);
    }

    setFiles([]);
    setOutputDir(null);
    setProgress(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
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

  return (
    <div className="w-[400px] mx-auto bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Pixel Converter</h1>
      <p className="text-center text-neutral-600 dark:text-neutral-400 text-sm">
        Drag and drop images here to convert them.
      </p>

      <DropZone
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        setFiles={setFiles}
        setProgress={setProgress}
        setConversionStatus={setConversionStatus}
        addUniqueImageFiles={addUniqueImageFiles}
        fileInputRef={fileInputRef}
      />

      <FileList files={files} setFiles={setFiles} fileInputRef={fileInputRef} />

      <ConversionOptions
        outputFormat={outputFormat}
        setOutputFormat={setOutputFormat}
        outputDir={outputDir}
        setOutputDir={setOutputDir}
        shouldShowOutputDir={shouldShowOutputDir}
        setShouldShowOutputDir={setShouldShowOutputDir}
        supportedFormats={SUPPORTED_OUTPUTS}
      />

      <ConvertButton
        files={files}
        onConvert={handleConvert}
        progress={progress}
      />

      <StatusMessage message={conversionStatus} />

      <FooterLinks setShowAbout={setShowAbout} />

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
}

export default App;
