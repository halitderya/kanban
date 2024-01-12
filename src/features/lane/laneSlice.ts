import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {Lane} from "../../types/linetype"
import { onValue, ref ,get, child} from "firebase/database";
import { db } from "../../utils/firebase";


const API_BASE_URL = 'https://kanban-31191-default-rtdb.europe-west1.firebasedatabase.app';

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
export const fetchLaneDataThunk = createAsyncThunk(
  'data/fetchAllLanes',
  async (_, thunkAPI) => {
    const data = await fetchData("/kanbanBoard/lanes");
    return data;
  },
  
);

// Thunk to fetch data by ID
export const fetchLaneIDThunk = createAsyncThunk<
Lane,
number

>(
  'data/fetchById',
  async (id, thunkAPI) => {
    const data = await fetchData(`/kanbanBoard/lanes/${id}`);
    return data;
  }
);



interface DataState {
  data: any;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  specificData:any
}

const initialState = {
  data: null,
  specificData:null,
  loading: 'idle',
} as DataState;

export const laneSlice = createSlice({
  name: 'laneData',
  initialState,
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaneDataThunk.fulfilled, (state, action) => {
        // Set the state with the fetched data
        state.data = action.payload;
      })
     .addCase(fetchLaneIDThunk.rejected, (state,action)=>{
console.error(action.error)

    })
      .addCase(fetchLaneIDThunk.fulfilled, (state, action) => {
        // Set the state with the data fetched by ID
        state.specificData = action.payload;
      });
  },
});
