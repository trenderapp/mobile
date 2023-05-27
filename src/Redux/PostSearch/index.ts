import { PostInterface } from "trender-client";
import { ADD_CREATED_TRENDS_SEARCH, ADD_TRENDS_SEARCH, DELETE_TRENDS_SEARCH, INIT_TRENDS_SEARCH, RESET_TRENDS_SEARCH } from "./actionTypes";

export const postSearchReducer = (state: PostInterface.postResponseSchema[] = [], action: {
    type: string,
    info: any
}): PostInterface.postResponseSchema[] => {
  switch (action.type) {
    case RESET_TRENDS_SEARCH:
        return [];
    case INIT_TRENDS_SEARCH:
        return action.info;
    case ADD_TRENDS_SEARCH:
        return [...state, ...action.info];
    case ADD_CREATED_TRENDS_SEARCH:
        return [action.info, ...state];
    case DELETE_TRENDS_SEARCH:
        return state.filter(p => p.post_id !== action.info);
    default:
      return state;
  }
};