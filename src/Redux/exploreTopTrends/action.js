import { ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS } from "./actionTypes";

export const resetExploreTopTrends = (info) => ({
    type: RESET_TRENDS,
    info,
});

export const addExploreTopTrends = (info) => ({
    type: ADD_TRENDS,
    info,
  });

export const initExploreTopTrends = (info) => ({
    type: INIT_TRENDS,
    info,
});

export const deleteExploreTopTrends = (info) => ({
    type: DELETE_TRENDS,
    info
})