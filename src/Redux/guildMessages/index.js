import { ADD_GUILD_MESSAGES, DELETE_GUILD_MESSAGES, INIT_GUILD_MESSAGES, RESET_GUILD_MESSAGES } from "./actionTypes";

export const guildMessagesReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_GUILD_MESSAGES:
            if (state.some(g => g.message_id === action.info[0].message_id)) return state;
            return [...action.info, ...state];
        case DELETE_GUILD_MESSAGES:
            return state.filter(g => g.message_id !== action.info);
        case RESET_GUILD_MESSAGES:
            return [];
        case INIT_GUILD_MESSAGES:
            return initialState.concat(action.info);
        default:
            return state;;
    }
};