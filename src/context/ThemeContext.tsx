import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
  isLoadingTheme: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  isLoadingTheme: true,
});

const THEME_STORAGE_KEY = "@theme";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("light");
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) {
          setTheme(storedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme from storage", error);
        // Mantém o tema padrão 'light' em caso de erro
      } finally {
        setIsLoadingTheme(false);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Failed to save theme to storage", error);
    }
  };

  if (isLoadingTheme) {
    return null; // Ou um componente de loading, se preferir
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoadingTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};