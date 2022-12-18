import { ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS } from "./actionTypes";

export const resetCommentTrends = (info) => ({
    type: RESET_TRENDS,
    info,
});

export const addCommentTrends = (info) => ({
    type: ADD_TRENDS,
    info,
  });

export const initCommentTrends = (info) => ({
    type: INIT_TRENDS,
    info,
});

export const deleteCommentTrends = (info) => ({
    type: DELETE_TRENDS,
    info
})