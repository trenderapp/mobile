import { ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS, ADD_CREATED_TRENDS } from "./actionTypes";

export const resetMainTrends = (info) => ({
    type: RESET_TRENDS,
    info,
});

export const addMainTrends = (info) => ({
    type: ADD_TRENDS,
    info,
  });

export const addMainCreatedTrends = (info) => ({
    type: ADD_CREATED_TRENDS,
    info,
});

export const initMainTrends = (info) => ({
    type: INIT_TRENDS,
    info,
});

export const deleteMainTrends = (info) => ({
    type: DELETE_TRENDS,
    info
})