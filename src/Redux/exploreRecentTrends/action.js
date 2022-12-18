import { ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS } from "./actionTypes";

export const resetExploreRecentTrends = (info) => ({
    type: RESET_TRENDS,
    info,
});

export const addExploreRecentTrends = (info) => ({
    type: ADD_TRENDS,
    info,
  });

export const initExploreRecentTrends = (info) => ({
    type: INIT_TRENDS,
    info,
});

export const deleteExploreRecentTrends = (info) => ({
    type: DELETE_TRENDS,
    info
})