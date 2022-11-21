import React from "react";
import ThemeProvider from "./Theme/ThemeProvider";

function ThemeContainer({ children }) {

    return (
        <ThemeProvider>
            { children }
        </ThemeProvider>
    )
}

export default ThemeContainer;