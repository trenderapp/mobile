import { PostInterface } from "trender-client";
import { ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS, ADD_CREATED_TRENDS } from "./actionTypes";

export const resetMainTrends = (info: []) => ({
    type: RESET_TRENDS,
    info,
});

export const addMainTrends = (info: PostInterface.postResponseSchema[]) => ({
    type: ADD_TRENDS,
    info,
  });

export const addMainCreatedTrends = (info: PostInterface.postResponseSchema) => ({
    type: ADD_CREATED_TRENDS,
    info,
});

export const initMainTrends = (info: PostInterface.postResponseSchema[]) => ({
    type: INIT_TRENDS,
    info,
});

export const deleteMainTrends = (info: PostInterface.postResponseSchema) => ({
    type: DELETE_TRENDS,
    info
})