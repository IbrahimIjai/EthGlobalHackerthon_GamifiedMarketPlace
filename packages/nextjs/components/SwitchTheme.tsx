import { useEffect } from "react";
import { useDarkMode, useIsMounted } from "usehooks-ts";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes"

export const SwitchTheme = ({ className }: { className?: string }) => {
  // const { isDarkMode, toggle } = useDarkMode();
  const isMounted = useIsMounted();


  const { theme, setTheme } = useTheme()

  // useEffect(() => {
  //   const body = document.body;
  //   body.setAttribute("data-theme", isDarkMode ? "scaffoldEthDark" : "scaffoldEth");
  // }, [isDarkMode]);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  return (
    <div className={`flex space-x-2 text-sm ${className}`}>
      <input
        id="theme-toggle"
        type="checkbox"
        className="toggle toggle-[#2563eb] bg-muted"
        onChange={toggleTheme}
        checked={theme === "dark"}
      />
      {isMounted() && (
        <label htmlFor="theme-toggle" className={`swap swap-rotate ${theme !== "dark" ? "swap-active" : ""}`}>
          <SunIcon className="swap-on h-5 w-5" />
          <MoonIcon className="swap-off h-5 w-5" />
        </label>
      )}
    </div>
  );
};
