import React from "react";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800">Vibe Requirements</h1>
        <p className="text-gray-600 mt-2">
          Generate PRD and Todo lists from your project requirements
        </p>
      </div>
    </header>
  );
};

export default Header;
