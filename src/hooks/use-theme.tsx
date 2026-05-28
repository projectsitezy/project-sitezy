import { createContext, useContext, useEffect, type ReactNode } from "react";

type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    try { localStorage.setItem("sitezy-theme", "light"); } catch {}
  }, []);

  return <ThemeContext.Provider value={{ theme: "light", toggle: () => {} }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
