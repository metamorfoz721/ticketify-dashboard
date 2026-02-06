import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    hue: number;
    toggleTheme: () => void;
    setHue: (hue: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem("theme");
        return (saved as Theme) || "light";
    });

    const [hue, setHue] = useState<number>(() => {
        const saved = localStorage.getItem("theme-hue");
        return saved ? parseInt(saved, 10) : 260; // Default to existing blue-ish hue
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.style.setProperty("--hue", hue.toString());
        localStorage.setItem("theme-hue", hue.toString());
    }, [hue]);

    const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

    return (
        <ThemeContext.Provider value={{ theme, hue, toggleTheme, setHue }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
};
