import React from "react";

const Header = () => {
  return (
    <header className="w-full bg-secondary shadow-sm py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold">Vibe Requirements</h1>
        <p className="text-secondary-foreground/80 mt-2">
          Generate PRD and Todo lists from your project requirements
        </p>
      </div>
    </header>
  );
};

export default Header;
