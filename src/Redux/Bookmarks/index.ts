import { PostInterface } from "trender-client";
import { ADD_CREATED_TRENDS_BOOKMARKS, ADD_TRENDS_BOOKMARKS, DELETE_TRENDS_BOOKMARKS, INIT_TRENDS_BOOKMARKS, RESET_TRENDS_BOOKMARKS } from "./actionTypes";

export const postBookmarksReducer = (state: PostInterface.postResponseSchema[] = [], action: {
    type: string,
    info: any
}): PostInterface.postResponseSchema[] => {
  switch (action.type) {
    case RESET_TRENDS_BOOKMARKS:
        return [];
    case INIT_TRENDS_BOOKMARKS:
        return action.info;
    case ADD_TRENDS_BOOKMARKS:
        return [...state, ...action.info];
    case ADD_CREATED_TRENDS_BOOKMARKS:
        return [action.info, ...state];
    case DELETE_TRENDS_BOOKMARKS:
        return state.filter(p => p.post_id !== action.info);
    default:
      return state;
  }
};