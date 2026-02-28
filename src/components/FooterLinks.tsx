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
    </div>
  );
};

export default FooterLinks;
