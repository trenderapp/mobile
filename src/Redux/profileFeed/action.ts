import { PostInterface } from "trender-client";
import { ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS } from "./actionTypes";

export const resetProfileTrends = (info: []) => ({
    type: RESET_TRENDS,
    info,
});

export const addProfileTrends = (info: PostInterface.postResponseSchema[]) => ({
    type: ADD_TRENDS,
    info,
  });

export const initProfileTrends = (info: PostInterface.postResponseSchema[]) => ({
    type: INIT_TRENDS,
    info,
});

export const deleteProfileTrends = (info: PostInterface.postResponseSchema) => ({
    type: DELETE_TRENDS,
    info
})