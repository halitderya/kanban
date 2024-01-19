 import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {Card} from "../../types/cardtype"
import { child, get, getDatabase, push, ref,set, update } from 'firebase/database';
import { db } from "../../utils/firebase";
import { v4 as uuid } from 'uuid';




const fetchData = async (endpoint = '') => {
  try {

    const snapshot = await get(child(ref(db), endpoint));
    if (snapshot.exists()) {
      let data = snapshot.val();

      return data; 
    } else {
      console.log("Data not available");
      return null; 
    }
  } catch (error) {
    console.error(error);
    return null; 
  }
};

const updateCard = async (endpoint = "", updatedCard: Card) => {
  const dbRef = ref(db, endpoint + updatedCard.id);

  try {
    await update(dbRef, { ...updatedCard });
    return updatedCard; 
  } catch (error) {
    console.error('error update', error);
    return null; 
  }
};




export const updateCardDataThunk=createAsyncThunk(

'data/updateCardData',
async(updatedCard:Card ,thunkAPI)=>{

 const data=  await updateCard("kanbanBoard/cards/",updatedCard);
  return (data as Card);
}
); 
interface Updates {
  [key: string]: Card;
}

export const populateAllCardsThunk = createAsyncThunk(
  'data/populateAllCards',
  async (_, thunkAPI) => {
    const data: Card[] = await fetch("/card.json").then((response) => response.json());
    
    const db = getDatabase();
    const updates: Updates = {};
    data.forEach((card: Card) => {
      // Generate a new key for each card
      const newCardKey = push(child(ref(db), 'kanbanBoard/cards')).key;

      if (newCardKey === null) {
        console.error('Failed to generate a new key for a card');
        return; // Skip this iteration
      }

      card.id = newCardKey;
      updates['/kanbanBoard/cards/' + newCardKey] = card;
    });

    return update(ref(db), updates)
      .then(() => {
        console.log('Synchronization succeeded');
      })
      .catch((error) => {
        console.error('Synchronization failed', error);
      });
  },
);

// Thunk to fetch all data
 export const fetchCardDataThunk = createAsyncThunk(
  'data/fetchAllCards',
  async (_, thunkAPI) => {
    const data = await fetchData("/kanbanBoard/cards");
    return data;
  },
  
);

// Thunk to fetch data by ID
export const fetchCardIDThunk = createAsyncThunk<
Card,
number

>(
  'data/fetchById',
  async (id, thunkAPI) => {
    const data = await fetchData(`/kanbanBoard/cards/${id}`);
    return data;
  }
);




interface DataState {
  data: { [key: string]: Card } | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  dataWithID:Card | null;
}

const initialState = {
  data: null,
  dataWithID:null,
  loading: 'idle',
} as DataState;

export const cardSlice = createSlice({
  name: 'cardData',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardDataThunk.fulfilled, (state, action) => {
        // Set the state with the fetched data
        state.data = action.payload;
      })
     .addCase(fetchCardDataThunk.rejected, (state,action)=>{

    })
      .addCase(fetchCardIDThunk.fulfilled, (state, action) => {
        state.dataWithID = action.payload;
      }) .addCase(updateCardDataThunk.fulfilled, (state, action) => {
        const updatedCard = action.payload;
        if (updatedCard && updatedCard.id) {
          if (!state.data) {
            state.data = { [updatedCard.id]: updatedCard };
          } else {
            state.data[updatedCard.id] = updatedCard;
          }
        }
      });
  },
});

  