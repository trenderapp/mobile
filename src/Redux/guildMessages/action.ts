import { ADD_GUILD_MESSAGES, ADD_SCROLL_GUILD_MESSAGES, DELETE_GUILD_MESSAGES, INIT_GUILD_MESSAGES, MODIFY_GUILD_MESSAGES, RESET_GUILD_MESSAGES } from "./actionTypes";
import { MessageType } from "../../Components/Chat";

export const resetGuildMessages = (info: any) => ({
    type: RESET_GUILD_MESSAGES,
    info,
});

export const addGuildMessages = (info: MessageType.Any[]) => ({
    type: ADD_GUILD_MESSAGES,
    info,
});

export const addScrollGuildMessages = (info: MessageType.Any[]) => ({
    type: ADD_SCROLL_GUILD_MESSAGES,
    info,
});

export const initGuildMessages = (info: MessageType.Any[]) => ({
    type: INIT_GUILD_MESSAGES,
    info,
});

export const deleteGuildMessages = (info: MessageType.Any) => ({
    type: DELETE_GUILD_MESSAGES,
    info
})

export const modifyGuildMessages = (info: MessageType.Any) => ({
    type: MODIFY_GUILD_MESSAGES,
    info
})