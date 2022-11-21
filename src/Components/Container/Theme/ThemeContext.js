import * as React from 'react';
import { DarkBlueTheme } from './Themes';

const ThemeContext = React.createContext({
    theme: "darkblue",
    /**
     * 
     * @param {"auto" | "darkblue" | "white" | "dark"} type 
     */
    setTheme: (type) => {},
    ...DarkBlueTheme
});

ThemeContext.displayName = 'ThemeContext';

export default ThemeContext;