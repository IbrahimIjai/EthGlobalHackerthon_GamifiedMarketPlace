import { useEffect } from "react";
import { Label } from "~~/components/ui/Label";
import { Switch } from "~~/components/ui/Switch";
import { useTheme } from "next-themes";
import { useDarkMode, useIsMounted } from "usehooks-ts";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export const SwitchTheme = ({ className }: { className?: string }) => {
  const isMounted = useIsMounted();

  const { theme, setTheme } = useTheme();

  // useEffect(() => {
  //   const body = document.body;
  //   body.setAttribute("data-theme", isDarkMode ? "scaffoldEthDark" : "scaffoldEth");
  // }, [isDarkMode]);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div className={`flex space-x-2 text-sm ${className}`}>
      <div className="flex items-center space-x-2">
        <Switch id="theme" onCheckedChange={toggleTheme} checked={theme === "dark"} />
      </div>
      {isMounted() && theme !== "dark" ? (
        <MoonIcon className="w-5 h-5 swap-off" />
      ) : (
        <SunIcon className="w-5 h-5 swap-on" />
      )}
    </div>
  );
};
