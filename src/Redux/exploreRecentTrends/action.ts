import { PostInterface } from "trender-client";
import { ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS } from "./actionTypes";

export const resetExploreRecentTrends = (info: []) => ({
    type: RESET_TRENDS,
    info,
});

export const addExploreRecentTrends = (info: PostInterface.postResponseSchema[]) => ({
    type: ADD_TRENDS,
    info,
  });

export const initExploreRecentTrends = (info: PostInterface.postResponseSchema[]) => ({
    type: INIT_TRENDS,
    info,
});

export const deleteExploreRecentTrends = (info: PostInterface.postResponseSchema) => ({
    type: DELETE_TRENDS,
    info
})