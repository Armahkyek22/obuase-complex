import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Font from 'expo-font';
import { LeagueSpartan_400Regular, LeagueSpartan_700Bold } from '@expo-google-fonts/league-spartan';

interface FontContextType {
  fontLoaded: boolean;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'LeagueSpartan-Regular': LeagueSpartan_400Regular,
        'LeagueSpartan-Bold': LeagueSpartan_700Bold,
      });
      setFontLoaded(true);
    }

    loadFonts();
  }, []);

  return (
    <FontContext.Provider value={{ fontLoaded }}>
      {fontLoaded ? children : null}
    </FontContext.Provider>
  );
};

export const useFonts = () => {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFonts must be used within a FontProvider');
  }
  return context;
};
