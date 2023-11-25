import * as React from 'react';
import { DarkBlueTheme, Ithemes } from './Themes';

const ThemeContext = React.createContext({
    theme: "darkblue",
    setTheme: (_type: Ithemes) => {},
    ...DarkBlueTheme
});

ThemeContext.displayName = 'ThemeContext';

export default ThemeContext;