import React, { useState } from "react";

export const SinglePostContext = React.createContext();

export const SinglePostContextProvider = ({ children, informations = {}}) => {
    
    const [info, setInfo] = useState(informations)
    
    return (
        <SinglePostContext.Provider value={{info, setInfo}}>
            { children }
        </SinglePostContext.Provider>
    )
}