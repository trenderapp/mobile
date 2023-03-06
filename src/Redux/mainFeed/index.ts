import { PostInterface } from "trender-client";
import { ADD_CREATED_TRENDS, ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS } from "./actionTypes";

export const mainFeedReducer = (state: PostInterface.postResponseSchema[] = [], action: {
    type: string,
    info: PostInterface.postResponseSchema[] | PostInterface.postResponseSchema | string
}): PostInterface.postResponseSchema[] => {
  switch (action.type) {
    case RESET_TRENDS:
        return [];
    case INIT_TRENDS:
        return action.info as PostInterface.postResponseSchema[];
    case ADD_TRENDS:
        return [...state, action.info] as PostInterface.postResponseSchema[];
    case ADD_CREATED_TRENDS:
        return [action.info, ...state] as PostInterface.postResponseSchema[];
    case DELETE_TRENDS:
        return state.filter(p => p.post_id !== action.info) as PostInterface.postResponseSchema[];
    default:
      return state as PostInterface.postResponseSchema[];
  }
};