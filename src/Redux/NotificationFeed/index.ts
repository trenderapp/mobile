import { NotificationInterface } from "trender-client";
import { MARK_READ_NOTIFICATION_FEED, ADD_NOTIFICATION_FEED, INIT_NOTIFICATION_FEED, RESET_NOTIFICATION_FEED } from "./actionTypes";

export const notificationFeedReducer = (state: NotificationInterface.notificationFetchResponseSchema[] = [], action: {
    type: string,
    info: any
}): NotificationInterface.notificationFetchResponseSchema[] => {
  switch (action.type) {
    case RESET_NOTIFICATION_FEED:
        return [];
    case INIT_NOTIFICATION_FEED:
        return action.info;
    case ADD_NOTIFICATION_FEED:
        return [...state, ...action.info];
    case MARK_READ_NOTIFICATION_FEED:
        return state.map((n) => {
            return {
                ...n,
                readed: true
            }
        });
    default:
      return state;
  }
};