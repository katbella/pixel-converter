import React from "react";

interface FooterLinksProps {
  setShowAbout: (value: boolean) => void;
}

const FooterLinks: React.FC<FooterLinksProps> = ({ setShowAbout }) => {
  return (
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
            "https://buymeacoffee.com/pixelator",
          )
        }
        className="text-cyan-500 hover:underline"
      >
        Buy me a coffee
      </button>
    </div>
  );
};

export default FooterLinks;
