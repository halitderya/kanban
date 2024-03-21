import { configureStore } from '@reduxjs/toolkit';
import {laneSlice} from '@/features/lane/laneSlice'; 
 import { cardSlice } from '@/features/card/cardSlice';
import { selectedCardSlice } from '@/features/card/selectedCardSlice';
import { sortMiddleware } from '@/features/lane/sortingMiddleware';

export const store = configureStore({
  reducer: {
   // counter: counterSlice,
    lanedata: laneSlice.reducer, 
     carddata: cardSlice.reducer, 
   selectedcard: selectedCardSlice.reducer
 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sortMiddleware), // Add your sortMiddleware here
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: { counter: CounterState, data: DataState }
export type AppDispatch = typeof store.dispatch;
