import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Card } from "../../types/cardtype";


interface DataState {
  selectedCard: Card | null; 
}

const initialState: DataState = {
  selectedCard: null, 
};

export const selectedCardSlice = createSlice({
  name: 'selectCard',
  initialState,
  reducers: {
   
    selectCard: (state, action: PayloadAction<Card | null>) => {
      state.selectedCard = action.payload; 
    },

  },
});


export const { selectCard } = selectedCardSlice.actions;
export default selectedCardSlice.reducer;
