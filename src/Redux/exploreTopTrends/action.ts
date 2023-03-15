import { PostInterface } from "trender-client";
import { ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS } from "./actionTypes";

export const resetExploreTopTrends = (info = []) => ({
    type: RESET_TRENDS,
    info,
});

export const addExploreTopTrends = (info: PostInterface.postResponseSchema[]) => ({
    type: ADD_TRENDS,
    info,
  });

export const initExploreTopTrends = (info: PostInterface.postResponseSchema[]) => ({
    type: INIT_TRENDS,
    info,
});

export const deleteExploreTopTrends = (info: PostInterface.postResponseSchema) => ({
    type: DELETE_TRENDS,
    info
})