import { ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS } from "./actionTypes";

export const resetProfileTrends = (info) => ({
    type: RESET_TRENDS,
    info,
});

export const addProfileTrends = (info) => ({
    type: ADD_TRENDS,
    info,
  });

export const initProfileTrends = (info) => ({
    type: INIT_TRENDS,
    info,
});

export const deleteProfileTrends = (info) => ({
    type: DELETE_TRENDS,
    info
})