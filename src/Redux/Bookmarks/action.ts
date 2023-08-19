import { PostInterface } from "trender-client";
import { ADD_TRENDS_BOOKMARKS, DELETE_TRENDS_BOOKMARKS, INIT_TRENDS_BOOKMARKS, RESET_TRENDS_BOOKMARKS, ADD_CREATED_TRENDS_BOOKMARKS } from "./actionTypes";

export const resetPostBookmarks = (info: []) => ({
    type: RESET_TRENDS_BOOKMARKS,
    info,
});

export const addPostBookmarks = (info: PostInterface.postResponseSchema[]) => ({
    type: ADD_TRENDS_BOOKMARKS,
    info,
  });

export const addMainCreatedTrends = (info: PostInterface.postResponseSchema) => ({
    type: ADD_CREATED_TRENDS_BOOKMARKS,
    info,
});

export const initPostBookmarks = (info: PostInterface.postResponseSchema[]) => ({
    type: INIT_TRENDS_BOOKMARKS,
    info,
});

export const deletePostBookmarks = (info: PostInterface.postResponseSchema) => ({
    type: DELETE_TRENDS_BOOKMARKS,
    info
})