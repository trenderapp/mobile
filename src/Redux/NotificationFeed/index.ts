import { NotificationInterface } from "trender-client";
import { MARK_READ_NOTIFICATION_FEED, ADD_NOTIFICATION_FEED, INIT_NOTIFICATION_FEED, RESET_NOTIFICATION_FEED, MARK_READ_ONE_NOTIFICATION_FEED } from "./actionTypes";

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
    case MARK_READ_ONE_NOTIFICATION_FEED:
        const index = state.findIndex(a => a.notification_id === action.info);
        if (index !== -1) {
          const newState = [
            ...state.slice(0, index), // Les éléments avant l'élément modifié
            { ...state[index], readed: true }, // Élément modifié avec readed à true
            ...state.slice(index + 1), // Les éléments après l'élément modifié
          ];
        
          return newState;
        } else {
          return state; // Aucun changement, retourne l'état inchangé
        }        
    default:
      return state;
  }
};