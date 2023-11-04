import { GuildInterface, MessageInterface } from "trender-client";
import { ADD_GUILDS, DELETE_GUILDS, INIT_GUILDS, MODIFY_GUILDS, RESET_GUILDS, UNREAD_GUILDS, CHANGE_MESSAGE_UNREAD_GUILDS } from "./actionTypes";
import dayjs from "dayjs";
import { IchangeLastMessageGuildList } from "./action";

export type guildI = GuildInterface.fetchGuildResponseSchema & { unread?: boolean } & { last_message: { message_id: string } } 

export const guildListReducer = (state: guildI[] = [], action: {
    type: string;
    info: any;
}): guildI[] => {
    const type = action.type;
    if (type === ADD_GUILDS) {
        if (state.some(g => g.guild_id === action.info[0].guild_id)) return state;
        return [...action.info, ...state];
    } else if (type ===  DELETE_GUILDS) {
        return state.filter(g => g.guild_id !== action.info);
    } else if (type ===  INIT_GUILDS) {
        return action.info;
    } else if (type ===  MODIFY_GUILDS) {
        const new_array = [...state];
        const { guild_id, content, created_at, message_id, unread } = action.info;
        const idx = new_array.findIndex(v => v.guild_id === guild_id);
        if (idx < 0) return state;        
        new_array[idx] = { ...new_array[idx], last_message: { content: content, created_at: created_at, message_id: message_id }, unread: unread }
        return new_array;
    } else if (type ===  UNREAD_GUILDS) {
        const unreads: MessageInterface.unreadFetchResponseInterface[] = action.info;
        return state.map((g) => {
          const find_unread = unreads.find(u => u.channel_id === g.guild_id);
        
          if (find_unread && find_unread.message_id !== g.last_message.message_id) {
            return {
              ...g,
              unread: true,
              last_message: {
                ...g.last_message,
                message_id: find_unread.message_id
              }
            };
          } else {
            return {
              ...g,
              unread: false
            };
          }
        });
        
    } else if (type ===  RESET_GUILDS) {
        return [];
    } else if (type ===  CHANGE_MESSAGE_UNREAD_GUILDS) {
        const { data, guild_id }: IchangeLastMessageGuildList = action.info;

        // Création d'une nouvelle copie de l'état
        const new_array = [...state];
        
        // Trouver l'index de la guilde à mettre à jour
        const idx = new_array.findIndex(g => g.guild_id === guild_id);
        
        if (idx !== -1) {
          // Créer une copie de l'objet correspondant à l'index
          const updatedGuild = {
            ...new_array[idx],
            last_message: data,
            unread: false
          };
        
          // Remplacer l'élément correspondant à l'index par la copie modifiée
          new_array[idx] = updatedGuild;
        }
        
        // Retourner la nouvelle copie de l'état
        return new_array;
        
    }
    return state;
};