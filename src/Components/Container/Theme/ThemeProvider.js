import * as React from 'react';
import { useColorScheme } from "react-native";

import ThemeContext from './ThemeContext';
import { DarkBlueTheme, WhiteTheme, DarkTheme } from './Themes';

function ThemeProvider({ children }) {

    const scheme = useColorScheme();
    const [theme, setTheme] = React.useState({
        type: "darkblue",
        ...DarkBlueTheme
    });

    /**
     * 
     * @param {"auto" | "darkblue" | "white" | "dark"} type 
     */
    const changeTheme = (type) => {
        
        let style = DarkBlueTheme;
        switch (type) {
            case "auto":
                style = scheme === "dark" ? DarkBlueTheme : WhiteTheme
                break;
            case "white":
                style = WhiteTheme
                break;
            case "dark":
                style = DarkTheme;
                break;
            default:
                break;
        }
        
        setTheme({
            type: type,
            ...style
        })
    }

    React.useEffect(() => {
        changeTheme("auto")
    }, [scheme])

    return (
        <ThemeContext.Provider value={{ setTheme: changeTheme, colors: theme.colors, theme: theme.type }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;