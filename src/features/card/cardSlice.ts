import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Card } from "../../types/cardtype";

import {
  apiGetRequestHandler,
  apiPostRequestHandler,
  apiDeleteRequestHandler,
  apiPutRequestHandler,
} from "@/utils/APIRequests";
import { Lane } from "@/types/linetype";
import { useDebounce } from "@/hooks/useDebounce";

const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY ?? "";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const removeAllCardsThunk = createAsyncThunk(
  "data/deleteAllCards",
  async (_, thunkAPI) => {
    return await apiDeleteRequestHandler("/cards/deleteAllCards");
  }
);

export const updateCardDataThunk = createAsyncThunk(
  "data/updateCardData",
  async (updatedCard: Card, thunkAPI) => {
    const value = await apiPostRequestHandler<Card | Lane>(
      "/cards/editCard/?id=" + updatedCard.id,
      updatedCard as Card
    );
    return value;
  }
);

interface Updates {
  [key: string]: Card;
}
//here we read data from json to upload as card, since we don't know what ID firebase will assign, we fetch assigned ID to assign the value of
// newCardKey then updating the card with this ID. We don't update redux store here. fetching also required.
export const populateAllCardsThunk = createAsyncThunk(
  "data/populateAllCards",
  async (_, thunkAPI) => {
    const data = await apiPostRequestHandler("/settings/createdefaultcards");
    return data;
  }
);

// Thunk to fetch all data
export const fetchCardDataThunk = createAsyncThunk(
  "data/fetchAllCards",
  async (_, thunkAPI) => {
    const data = await apiGetRequestHandler(
      "/cards/allCards",
      "fetchCardDataThunk"
    );

    return data;
  }
);
//Thunk to add new Card

export const addCardThunk = createAsyncThunk(
  "data/addCard",
  async (newCard: Card, thunkAPI) => {
    if (newCard) {
      const data = await apiPostRequestHandler("/cards/addCard", newCard);
      return data;
    }
  }
);

const initialState = {
  data: null,
  dataWithID: null,
  loading: "idle",
} as DataState;

interface DataState {
  data: { [key: string]: Card } | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  dataWithID: Card | null;
}
function isCard(obj: any): obj is Card {
  return "id" in obj && "name" in obj && "lane" in obj;
}

export const cardSlice = createSlice({
  name: "cardData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardDataThunk.fulfilled, (state, action) => {
        // Set the state with the fetched data

        state.data = action.payload;
      })
      .addCase(fetchCardDataThunk.rejected, (state, action) => {})

      .addCase(populateAllCardsThunk.fulfilled, (state, action) => {});
  },
});
