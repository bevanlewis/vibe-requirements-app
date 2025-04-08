import React from "react";

const Header = React.memo(() => {
  return (
    <header className="w-full bg-secondary shadow-sm py-6" role="banner">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold" tabIndex={0}>
          Vibe Requirements
        </h1>
        <p className="text-secondary-foreground/80 mt-2" tabIndex={0}>
          Generate PRD and Todo lists from your project description
        </p>
      </div>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
