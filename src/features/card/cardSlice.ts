 import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {Card} from "../../types/cardtype"
import { child, get, ref } from 'firebase/database';
import { db } from "../../utils/firebase";


//const API_BASE_URL = 'https://kanban-31191-default-rtdb.europe-west1.firebasedatabase.app';

// Fetch data from the API
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
  data: any;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  dataWithID:any
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
        // Set the state with the data fetched by ID
        state.dataWithID = action.payload;
      });
  },
});
  