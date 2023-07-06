import { PostInterface } from "trender-client";
import { ADD_CREATED_TRENDS_SHARES, ADD_TRENDS_SHARES, DELETE_TRENDS_SHARES, INIT_TRENDS_SHARES, RESET_TRENDS_SHARES } from "./actionTypes";

export const postSharesReducer = (state: PostInterface.postResponseSchema[] = [], action: {
    type: string,
    info: any
}): PostInterface.postResponseSchema[] => {
  switch (action.type) {
    case RESET_TRENDS_SHARES:
        return [];
    case INIT_TRENDS_SHARES:
        return action.info;
    case ADD_TRENDS_SHARES:
        return [...state, ...action.info];
    case ADD_CREATED_TRENDS_SHARES:
        return [action.info, ...state];
    case DELETE_TRENDS_SHARES:
        return state.filter(p => p.post_id !== action.info);
    default:
      return state;
  }
};