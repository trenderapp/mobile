import * as React from 'react';
import { useColorScheme } from "react-native";

import ThemeContext from './ThemeContext';
import { DarkBlueTheme, WhiteTheme, DarkTheme, Ithemes, DarkPinkTheme, DarkGreenTheme, DarkGreyTheme } from './Themes';

type Props = {
    children: React.ReactNode
}

const ThemeProvider: React.FC<Props> = ({ children }) => {

    const scheme = useColorScheme();
    const [theme, setTheme] = React.useState({
        type: "darkblue",
        ...DarkBlueTheme
    });

    const changeTheme = (type: Ithemes) => {
        
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
            case "dark_pink":
                style = DarkPinkTheme;
                break;
            case "dark_green":
                style = DarkGreenTheme;
                break;
            case "dark_grey":
                style = DarkGreyTheme;
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