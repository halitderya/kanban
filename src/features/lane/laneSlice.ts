import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {Lane} from "../../types/linetype"
import { onValue, ref ,get, child, getDatabase, push, update,remove} from "firebase/database";
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
      console.error("Data not available");
      return null; 
    }
  } catch (error) {
    console.error(error);
    return null; 
  }
};
interface Updates {
  [key: string]: Lane;
}
export const addNewLaneThunk=createAsyncThunk(
'data/addNewLane',
async(lane:Lane,thunkAPI)=>{



  const newLaneKey = push(child(ref(db), 'kanbanBoard/lanes')).key;
if (newLaneKey !== null) {
  const updates: Updates = {};

  lane.dbid = newLaneKey;
  updates['/kanbanBoard/lanes/' + newLaneKey] = lane;
  return await update(ref(db), updates)
  .then(() => {

  })
}
else{

  console.error("failed to generate a key for a new line")
}


}


)
export const populateDefaultLanesThunk = createAsyncThunk(
  'data/populateDefaultLanes',

  async (_, thunkAPI) => {
  

    const data: Lane[] = await fetch("/lane.json").then((response) => response.json());
    
    const db = getDatabase();
    const updates: Updates = {};
//all data to be deleted before lanes populated
 
await remove(ref(db,'kanbanBoard/lanes')).then(()=>{

  data.forEach((lane: Lane) => {
    // Generate a new key for each card
    const newLaneKey = push(child(ref(db), 'kanbanBoard/lanes')).key;

    if (newLaneKey === null) {
      console.error('Failed to generate a new key for a card');
      return; // Skip this iteration
    }

    lane.dbid = newLaneKey;
    updates['/kanbanBoard/lanes/' + newLaneKey] = lane;
  });


})
    return await update(ref(db), updates)
      .then(() => {
        console.log('Synchronization succeeded');

      })

      .catch((error) => {
        console.error('Synchronization failed', error);
      });
  },
);



// Thunk to fetch all data
export const fetchLaneDataThunk = createAsyncThunk(
  'data/fetchAllLanes',
  async (_, thunkAPI) => {
    const data = await fetchData("/kanbanBoard/lanes");
    return data;
  },
  
);

export const updateLane = async (endpoint = "", updatedLane: Lane) => {
  const dbRef = ref(db, endpoint + updatedLane.dbid);

  try {
    await update(dbRef, { ...updatedLane });
    return updatedLane; 
  } catch (error) {
    console.error('error update', error);
    return null; 
  }
};


export const updateLaneDataThunk=createAsyncThunk(

  'data/updateLaneData',
  async(updatedLane:Lane ,thunkAPI)=>{
  
    
   const data=  await updateLane("kanbanBoard/lanes/",updatedLane);
    return (data as Lane);
  }
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
      .addCase(updateLaneDataThunk.rejected,(state,action)=>{
        console.error(action.error)



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
