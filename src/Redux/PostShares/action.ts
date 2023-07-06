import { PostInterface } from "trender-client";
import { ADD_TRENDS_SHARES, DELETE_TRENDS_SHARES, INIT_TRENDS_SHARES, RESET_TRENDS_SHARES, ADD_CREATED_TRENDS_SHARES } from "./actionTypes";

export const resetPostShares = (info: []) => ({
    type: RESET_TRENDS_SHARES,
    info,
});

export const addPostShares = (info: PostInterface.postResponseSchema[]) => ({
    type: ADD_TRENDS_SHARES,
    info,
  });

export const addMainCreatedTrends = (info: PostInterface.postResponseSchema) => ({
    type: ADD_CREATED_TRENDS_SHARES,
    info,
});

export const initPostShares = (info: PostInterface.postResponseSchema[]) => ({
    type: INIT_TRENDS_SHARES,
    info,
});

export const deletePostShares = (info: PostInterface.postResponseSchema) => ({
    type: DELETE_TRENDS_SHARES,
    info
})