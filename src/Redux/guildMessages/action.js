import { ADD_GUILD_MESSAGES, DELETE_GUILD_MESSAGES, INIT_GUILD_MESSAGES, MODIFY_GUILD_MESSAGES, RESET_GUILD_MESSAGES } from "./actionTypes";

export const resetGuildMessages = (info) => ({
    type: RESET_GUILD_MESSAGES,
    info,
});

export const addGuildMessages = (info) => ({
    type: ADD_GUILD_MESSAGES,
    info,
  });

export const initGuildMessages = (info) => ({
    type: INIT_GUILD_MESSAGES,
    info,
});

export const deleteGuildMessages = (info) => ({
    type: DELETE_GUILD_MESSAGES,
    info
})

export const modifyGuildMessages = (info) => ({
    type: MODIFY_GUILD_MESSAGES,
    info
})