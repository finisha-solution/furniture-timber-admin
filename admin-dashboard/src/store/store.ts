import { configureStore } from '@reduxjs/toolkit';

// a simple reducer that returns an empty state
const rootReducer = (state = {}, action: any) => {
  return state;
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;