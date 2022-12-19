import { ADD_GUILDS, DELETE_GUILDS, INIT_GUILDS, MODIFY_GUILDS, RESET_GUILDS } from "./actionTypes";

export const guildListReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_GUILDS:
            if (state.some(g => g.guild_id === action.info[0].guild_id)) return state;
            return [...action.info, ...state];
        case DELETE_GUILDS:
            return state.filter(g => g.guild_id !== action.info);
        case RESET_GUILDS:
            return [];
        case INIT_GUILDS:
            return initialState.concat(action.info);
        case MODIFY_GUILDS:
            const new_array = [...state];
            const { guild_id, content, created_at, message_id } = action.info;
            const idx = new_array.findIndex(v => v.guild_id === guild_id);
            if (idx < 0) return state;
            new_array[idx] = { ...new_array[idx], last_message: { content: content, created_at: created_at, message_id: message_id } }
            return new_array;
        default:
            return state;;
    }
};