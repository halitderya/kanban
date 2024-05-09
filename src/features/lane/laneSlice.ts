import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Lane } from "../../types/linetype";

import {
  apiDeleteRequestHandler,
  apiGetRequestHandler,
  apiPostRequestHandler,
  apiPutRequestHandler,
} from "@/utils/APIRequests";

const API_BASE_URL =
  "https://kanban-31191-default-rtdb.europe-west1.firebasedatabase.app";
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY ?? "";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchData = async (endpoint: string = "/lanes") => {
  try {
    const snapshot = await fetch(API_URL + endpoint + "/allLanes", {
      method: "GET",

      headers: {
        "x-api-key": API_KEY,
      },
    });

    if (snapshot.ok) {
      let data = await snapshot.json();
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

export const addNewLaneThunk = createAsyncThunk(
  "data/addNewLane",

  async (lane: Lane, thunkAPI) => {
    if (lane) return await apiPostRequestHandler("/lanes/addLane/", lane);
  }
);

export const deleteSingleLaneThunk = createAsyncThunk(
  "data/deleteSingleLane",
  async (laneDBID: string, thunkAPI) => {
    const response = await apiDeleteRequestHandler(
      "/lanes/deleteLane/",
      "?id=" + laneDBID
    );

    return response;
  }
);
export const populateDefaultLanesThunk = createAsyncThunk(
  "data/populateDefaultLanes",

  async (_, thunkAPI) => {
    return await apiPutRequestHandler("/settings/resetDefaultLanes");
  }
);

// Thunk to fetch all data
export const fetchLaneDataThunk = createAsyncThunk(
  "data/fetchAllLanes",
  async (_, thunkAPI) => {
    return await apiGetRequestHandler("/lanes/allLanes", "");
  }
);

export const updateLaneActiveThunk = createAsyncThunk(
  "data/updateLaneActiveThunk",

  async (updatedLane: Lane, thunkAPI) => {
    const data = await apiPostRequestHandler(
      "/lanes/changeLaneArchive",
      updatedLane
    );
    return data as Lane;
  }
);
export const updateLaneDataThunk = createAsyncThunk(
  "data/updateLaneData",
  async (updatedLanes: Lane[], thunkAPI) => {
    const data = await apiPostRequestHandler(
      "/lanes/updateLane/",
      updatedLanes
    );
    return data as Lane;
  }
);

// Thunk to fetch data by ID
export const fetchLaneIDThunk = createAsyncThunk<Lane, number>(
  "data/fetchById",
  async (id, thunkAPI) => {
    const data = await fetchData(`/kanbanBoard/lanes/${id}`);
    return data;
  }
);

interface DataState {
  data: any;
  loading: "idle" | "pending" | "succeeded" | "failed";
  specificData: any;
}

const initialState = {
  data: null,
  specificData: null,
  loading: "idle",
} as DataState;

export const laneSlice = createSlice({
  name: "laneData",
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
      .addCase(updateLaneDataThunk.rejected, (state, action) => {
        console.error(action.error);
      })
      .addCase(fetchLaneIDThunk.rejected, (state, action) => {
        console.error(action.error);
      })
      .addCase(fetchLaneIDThunk.fulfilled, (state, action) => {
        // Set the state with the data fetched by ID
        state.specificData = action.payload;
      });
  },
});
