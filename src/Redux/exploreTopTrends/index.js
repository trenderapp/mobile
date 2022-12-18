import { ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS } from "./actionTypes";

export const exploreTopTrendsReducer = (state = [], action) => {
  switch (action.type) {
    case RESET_TRENDS:
        return [];
    case INIT_TRENDS:
        return action.info;
    case ADD_TRENDS:
        return state.concat(action.info);
    case DELETE_TRENDS:
        return state.filter(p => p.TRENDS_id !== action.info);
    default:
      return state;
  }
};