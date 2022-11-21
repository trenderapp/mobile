import React, { useReducer } from 'react'

export const initialState = []

const ADD_DM_MESSAGE = "ADD_DM_MESSAGE";
const DELETE_DM_MESSAGE = "DELETE_DM_MESSAGE";
const RESET_DM_MESSAGE = "RESET_DM_MESSAGE";
const INIT_DM_MESSAGE = "INIT_DM_MESSAGE";
const ADD_ONE_DM_MESSAGE = "ADD_ONE_DM_MESSAGE";

export const resetDmMessages = () => {
    return {
        type: RESET_DM_MESSAGE
    }
}

export const addDmMessages = (info) => {
    return {
      type: ADD_DM_MESSAGE,
      info: info
    }
}

export const addOneDmMessages = (info) => {
    return {
      type: ADD_ONE_DM_MESSAGE,
      info: info
    }
}

export const initDmMessages = (info) => {
    return {
      type: INIT_DM_MESSAGE,
      info: info
    }
}

export const deleteDmMessages = (info) => {
    return {
      type: RESET_DM_MESSAGE,
      info: info
    }
}

export const reducer = (state = initialState, action) => {
    
    switch(action.type) {
        case ADD_DM_MESSAGE:
            return [...state, ...action.info];
        case ADD_ONE_DM_MESSAGE:
            return [action.info, ...state];
        case DELETE_DM_MESSAGE :
            return state.filter(g => g.guild_id !== action.info);
        case RESET_DM_MESSAGE :
            return [];
        case INIT_DM_MESSAGE:
            return initialState.concat(action.info);
        default:
            return state;
    }
}

export const DmMessagesListContext = React.createContext({
    messages: [],
    dispatch: () => {}
});

export const DmMessagesListContextProvider = ({ children }) => {
    const [messages, dispatch] = useReducer(reducer, initialState)
    
    return (
        <DmMessagesListContext.Provider value={{messages, dispatch}}>
            { children }
        </DmMessagesListContext.Provider>
    )
}