import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { configureStore } from "@reduxjs/toolkit";

// Importe les réducteurs à partir de différents fichiers
import { mainFeedReducer } from './mainFeed';
import { exploreRecentTrendsReducer } from './exploreRecentTrends';
import { exploreTopTrendsReducer } from './exploreTopTrends';
import { profileFeedReducer } from './profileFeed';
import { commentFeedReducer } from './commentFeed';
import { guildListReducer } from './guildList';
import { guildMessagesReducer } from './guildMessages';

// Combine les réducteurs en un seul objet de réducteur
const rootReducer = combineReducers({
  // Associe chaque réducteur à une clé dans l'état de l'application
  mainFeed: mainFeedReducer,
  exploreRecentTrends: exploreRecentTrendsReducer,
  exploreTopTrends: exploreTopTrendsReducer,
  profileFeed: profileFeedReducer,
  commentFeed: commentFeedReducer,
  guildList: guildListReducer,
  guildMessages: guildMessagesReducer
});

// Crée le magasin Redux en utilisant le réducteur combiné
export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector