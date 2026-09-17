import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ColorTheme = 'terracotta' | 'ocean' | 'forest' | 'plum' | 'slate';

export const COLOR_THEMES: { id: ColorTheme; label: string; swatch: string }[] = [
  { id: 'terracotta', label: 'Terracotta', swatch: '#96421F' },
  { id: 'ocean', label: 'Ocean', swatch: '#2563EB' },
  { id: 'forest', label: 'Forest', swatch: '#3D6432' },
  { id: 'plum', label: 'Plum', swatch: '#723A56' },
  { id: 'slate', label: 'Slate', swatch: '#475569' },
];

interface ColorThemeContextValue {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ColorThemeContext = createContext<ColorThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'careerai-color-theme';

function isColorTheme(value: string | null): value is ColorTheme {
  return !!value && COLOR_THEMES.some((t) => t.id === value);
}

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isColorTheme(stored) ? stored : 'terracotta';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-color-theme', colorTheme);
    localStorage.setItem(STORAGE_KEY, colorTheme);
  }, [colorTheme]);

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  const ctx = useContext(ColorThemeContext);
  if (!ctx) throw new Error('useColorTheme must be used within ColorThemeProvider');
  return ctx;
}
