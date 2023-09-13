import { PostInterface } from "trender-client";
import { ADD_TRENDS } from "./actionTypes";

export const postTempSaveFeedReducer = (
  state: PostInterface.postResponseSchema[] = [],
  action: {
    type: string;
    info: PostInterface.postResponseSchema[];
  }
): PostInterface.postResponseSchema[] => {
  switch (action.type) {
    case ADD_TRENDS:
      // Filtrer les éléments de action.info qui ne sont pas déjà dans state
      const newItems = action.info.filter((item: PostInterface.postResponseSchema) =>
        !state.some((existingItem) => existingItem.post_id === item.post_id)
      );

      // Ajouter les nouveaux éléments à state
      return [...state, ...newItems];

    default:
      return state;
  }
};
