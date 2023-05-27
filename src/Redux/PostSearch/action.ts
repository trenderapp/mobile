import { PostInterface } from "trender-client";
import { ADD_TRENDS_SEARCH, DELETE_TRENDS_SEARCH, INIT_TRENDS_SEARCH, RESET_TRENDS_SEARCH, ADD_CREATED_TRENDS_SEARCH } from "./actionTypes";

export const resetPostSearch = (info: []) => ({
    type: RESET_TRENDS_SEARCH,
    info,
});

export const addPostSearch = (info: PostInterface.postResponseSchema[]) => ({
    type: ADD_TRENDS_SEARCH,
    info,
  });

export const addMainCreatedTrends = (info: PostInterface.postResponseSchema) => ({
    type: ADD_CREATED_TRENDS_SEARCH,
    info,
});

export const initPostSearch = (info: PostInterface.postResponseSchema[]) => ({
    type: INIT_TRENDS_SEARCH,
    info,
});

export const deletePostSearch = (info: PostInterface.postResponseSchema) => ({
    type: DELETE_TRENDS_SEARCH,
    info
})