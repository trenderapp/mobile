import { NotificationInterface } from "trender-client";
import { ADD_NOTIFICATION_FEED, INIT_NOTIFICATION_FEED, RESET_NOTIFICATION_FEED, MARK_READ_NOTIFICATION_FEED, MARK_READ_ONE_NOTIFICATION_FEED } from "./actionTypes";

export const resetNotificationFeed = (info: []) => ({
    type: RESET_NOTIFICATION_FEED,
    info,
});

export const addNotificationFeed= (info: NotificationInterface.notificationFetchResponseSchema[]) => ({
    type: ADD_NOTIFICATION_FEED,
    info,
  });

export const readNotificationFeed = () => ({
    type: MARK_READ_NOTIFICATION_FEED
});

export const initNotificationFeed = (info: NotificationInterface.notificationFetchResponseSchema[]) => ({
    type: INIT_NOTIFICATION_FEED,
    info,
});

export const readOneNotificationFeed = (info: string) => ({
    type: MARK_READ_ONE_NOTIFICATION_FEED,
    info
});