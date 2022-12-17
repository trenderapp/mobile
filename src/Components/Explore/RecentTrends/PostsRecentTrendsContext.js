import React, { useReducer } from 'react'

export const initialState = []

const ADD_POST = "ADD_POST";
const DELETE_POST = "DELETE_POST";
const RESET_POST = "RESET_POST";
const INIT_POST = "INIT_POST";

export const resetPost = () => {
    return {
        type: RESET_POST
    }
}

export const addPosts = (info) => {
    return {
      type: ADD_POST,
      info: info
    }
}

export const initPosts = (info) => {
    return {
      type: INIT_POST,
      info: info
    }
}

export const deletePosts = (info) => {
    return {
      type: DELETE_POST,
      info: info
    }
}

export const reducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_POST:
            if(state.some(i => i.post_id === action.info.post_id)) return;
            return state.concat(action.info);
        case DELETE_POST :
            return state.filter(p => p.post_id !== action.info);
        case RESET_POST :
            return [];
        case INIT_POST:
            return initialState.concat(action.info);
        default:
            return state;
    }
}

export const PostsRecentTrendsContext = React.createContext({
    posts: [],
    dispatch: () => {}
});

export const PostsRecentTrendsContextProvider = ({ children }) => {
    const [posts, dispatch] = useReducer(reducer, initialState)
    
    return (
        <PostsRecentTrendsContext.Provider value={{posts, dispatch}}>
            { children }
        </PostsRecentTrendsContext.Provider>
    )
}