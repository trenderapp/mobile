import { GlobalInterface } from "trender-client";
import { ADD_USERS, INIT_USERS, RESET_USERS } from "./actionTypes";

export const exploreTopUsersReducer = (state: GlobalInterface.userInfo[] = [], action: {
    type: string,
    info: any
}): GlobalInterface.userInfo[] => {
  switch (action.type) {
    case RESET_USERS:
        return [];
    case INIT_USERS:
        return action.info;
    case ADD_USERS:
        return [...state, ...action.info];
    default:
      return state;
  }
};