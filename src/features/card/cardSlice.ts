 import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {Card} from "../../types/cardtype"
import { child, get, push, ref,set, update } from 'firebase/database';
import { db } from "../../utils/firebase";
import CardJson from "../../../public/card.json"


const populateAllCards = (data: Card[]) => {

  set(ref(db, 'kanbanBoard/cards'), data)
    .then(() => {
      console.log('Synchronization succeeded');
    })
    .catch((error) => {
      console.error('Synchronization failed');
    });
};


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

const updateCard= async (endpoint= '',updatedCard:Card)=>{
  const snapshot = (await get(child(ref(db), endpoint))).key;

console.log("snapshot key",snapshot,"newpostkey")

  try{

    update(ref(db, 'kanbanBoard/cards/' + endpoint), updatedCard)
    .then(() => {
      // Data saved successfully!
      console.log("updatedcard: ",updatedCard)
    })
    .catch((error) => {
      // The write failed...
      console.error('error update',error);
      
    });
  }
  catch(error){

    console.error(error);
  }
}



export const updateCardDataThunk=createAsyncThunk(

'data/updateCardData',
async(updatedCard:Card,thunkAPI)=>{

  await updateCard("/kanbanBoard/cards",updatedCard);
  
}
); 


export const populateAllCardsThunk = createAsyncThunk(
  'data/populateAllCards',
  async (_, thunkAPI) => {
    const data = await fetchData("../../../public/card.json");


    console.log("data",data)
    await populateAllCards(data);
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
      }).addCase(updateCardDataThunk.fulfilled,(state,action)=>{

        state.data=action.payload;
      });
  },
});
  