import { GuildInterface, MessageInterface } from "trender-client";
import { ADD_GUILDS, DELETE_GUILDS, INIT_GUILDS, MODIFY_GUILDS, RESET_GUILDS, UNREAD_GUILDS } from "./actionTypes";

export const resetGuildList = (info = []) => ({
    type: RESET_GUILDS,
    info,
});

export const addGuildList = (info: GuildInterface.fetchGuildResponseSchema[]) => ({
    type: ADD_GUILDS,
    info,
  });

export const initGuildList = (info: GuildInterface.fetchGuildResponseSchema[]) => ({
    type: INIT_GUILDS,
    info,
});

export const deleteGuildList = (info: string) => ({
    type: DELETE_GUILDS,
    info
})

export const modifyGuildList = (info: { guild_id: string, content: string, created_at: string, message_id: string }) => ({
    type: MODIFY_GUILDS,
    info
})

export const setUnreadGuildList = (info: MessageInterface.unreadFetchResponseInterface[]) => ({
    type: UNREAD_GUILDS,
    info
})