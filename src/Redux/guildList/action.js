import { ADD_GUILDS, DELETE_GUILDS, INIT_GUILDS, MODIFY_GUILDS, RESET_GUILDS } from "./actionTypes";

export const resetGuildList = (info) => ({
    type: RESET_GUILDS,
    info,
});

export const addGuildList = (info) => ({
    type: ADD_GUILDS,
    info,
  });

export const initGuildList = (info) => ({
    type: INIT_GUILDS,
    info,
});

export const deleteGuildList = (info) => ({
    type: DELETE_GUILDS,
    info
})

export const modifyGuildList = (info) => ({
    type: MODIFY_GUILDS,
    info
})