import { GuildInterface, MessageInterface } from "trender-client";
import { ADD_GUILDS, DELETE_GUILDS, INIT_GUILDS, MODIFY_GUILDS, RESET_GUILDS, UNREAD_GUILDS } from "./actionTypes";

export type guildI = GuildInterface.fetchGuildResponseSchema & { unread?: boolean } & { last_message: { message_id: string } } 

export const guildListReducer = (state: guildI[] = [], action: {
    type: string;
    info: any;
}): guildI[] => {
    switch (action.type) {
        case ADD_GUILDS:
            if (state.some(g => g.guild_id === action.info[0].guild_id)) return state;
            return [...action.info, ...state];
        case DELETE_GUILDS:
            return state.filter(g => g.guild_id !== action.info);
        case RESET_GUILDS:
            return [];
        case INIT_GUILDS:
            return state.concat(action.info);
        case MODIFY_GUILDS:
            const new_array = [...state];
            const { guild_id, content, created_at, message_id } = action.info;
            const idx = new_array.findIndex(v => v.guild_id === guild_id);
            if (idx < 0) return state;
            new_array[idx] = { ...new_array[idx], last_message: { content: content, created_at: created_at, message_id: message_id } }
            return new_array;
        case UNREAD_GUILDS:
            const unreads: MessageInterface.unreadFetchResponseInterface[] = action.info;
            return state.map((g) => {
                const find_unread = unreads.find(u => u.channel_id === g.guild_id);
                if(find_unread) {
                    return {
                        ...g,
                        unread: true,
                        last_message: {
                            ...g.last_message,
                            message_id: find_unread.message_id
                        }
                    }
                } else {
                    return {
                        ...g,
                        unread: false
                    }
                }
            });
        default:
            return state;
    }
};