import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export const DarkModeButton: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check if dark mode is already enabled
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    // Apply or remove dark class on document root
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <Button
      onClick={toggleDarkMode}
      variant="outline"
      size="icon"
      className="rounded-full"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <SunIcon />
      ) : (
        <MoonIcon />
      )}
    </Button>
  );
};
