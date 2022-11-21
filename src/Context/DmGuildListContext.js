import React, { useReducer, useState } from 'react'

export const initialState = []

const ADD_DM_GROUP = "ADD_DM_GROUP";
const DELETE_DM_GROUP = "DELETE_DM_GROUP";
const RESET_DM_GROUP = "RESET_DM_GROUP";
const INIT_DM_GROUP = "INIT_DM_GROUP";
const MODIFY_DM_GROUP = "MODIFY_DM_GROUP";

export const resetDmGroup = () => {
    return {
        type: RESET_DM_GROUP
    }
}

export const addDmGroup = (info) => {
    return {
      type: ADD_DM_GROUP,
      info: info
    }
}

export const initDmGroup = (info) => {
    return {
      type: INIT_DM_GROUP,
      info: info
    }
}

export const deleteDmGroup = (info) => {
    return {
      type: DELETE_DM_GROUP,
      info: info
    }
}


export const modifyDmGroup = (info) => {
    return {
      type: MODIFY_DM_GROUP,
      info: info
    }
}

export const reducer = (state = initialState, action) => {
    
    switch(action.type) {
        case ADD_DM_GROUP:
            if(state.some(g => g.guild_id === action.info[0].guild_id)) return state;
            return [...action.info, ...state];
        case DELETE_DM_GROUP :
            return state.filter(g => g.guild_id !== action.info);
        case RESET_DM_GROUP :
            return [];
        case INIT_DM_GROUP:
            return initialState.concat(action.info);
        case MODIFY_DM_GROUP:
            const new_array = [...state];
            const { guild_id, content, created_at, message_id } = action.info;
            const idx = new_array.findIndex(v => v.guild_id === guild_id);
            if(idx < 0) return state;
            new_array[idx] = { ...new_array[idx], last_message: { content: content, created_at: created_at, message_id: message_id }}
            return new_array;
        default:
            return state;
    }
}

export const DmGroupListContext = React.createContext({
    groups: [],
    unreads: [],
    changeLastMessageUnreads: (guild_id, message_id, read = false) => {},
    setUnreads: () => {},
    dispatch: () => {}
});

export const DmGroupListContextProvider = ({ children }) => {
    const [groups, dispatch] = useReducer(reducer, initialState);
    const [unreads, setUnreads] = useState([]);
    
    const changeLastMessageUnreads = (guild_id, message_id, read = false) => {
        const idx = unreads.findIndex(g => g.channel_id === guild_id);
        const new_array = unreads;
        if(idx < 0) {
            new_array.push({
                "message_id": message_id,
                "channel_id": guild_id,
                "created_at": new Date(),
                read: true
            })
            setUnreads(new_array)
        } else {
            const new_array = unreads;
            new_array[idx].message_id = message_id;
            new_array[idx].read = read;
            setUnreads(new_array);
        }
    }

    return (
        <DmGroupListContext.Provider value={{groups, dispatch, unreads, setUnreads, changeLastMessageUnreads}}>
            { children }
        </DmGroupListContext.Provider>
    )
}