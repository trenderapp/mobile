import * as React from 'react';
import { DarkBlueTheme } from './Themes';

const ThemeContext = React.createContext({
    theme: "darkblue",
    setTheme: (_type: "auto" | "darkblue" | "white" | "dark") => {},
    ...DarkBlueTheme
});

ThemeContext.displayName = 'ThemeContext';

export default ThemeContext;