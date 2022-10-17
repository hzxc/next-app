import {
  configureStore,
  combineReducers,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import counterReducer from 'redux/counter/counterSlice';
import pancakeReducer from 'redux/pancake/pancakeSlice';
import pancakePersistReducer from 'redux/pancake/pancakePersistSlice';
import expireReducer from 'redux-persist-expire';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from './storage';
import { baseTokens } from 'data/pancake';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['pancakePersist'],
  transforms: [
    expireReducer('pancakePersist', {
      // persistedAtKey: 'loadedAt',
      expireSeconds: 60 * 60 * 24,
      // expireSeconds: 60,
      expiredState: {
        tokens: null,
        baseTokens: baseTokens,
      },
      autoExpire: true,
    }),
  ],
};

const rootReducer = combineReducers({
  counter: counterReducer,
  pancake: pancakeReducer,
  pancakePersist: pancakePersistReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: true,
});

let persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export { store, persistor };
