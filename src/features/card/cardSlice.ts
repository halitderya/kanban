import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Card } from "../../types/cardtype";
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
// import { db } from "../../utils/firebase";
import {
  apiGetRequestHandler,
  apiPostRequestHandler,
  apiDeleteRequestHandler,
} from "@/utils/APIRequests";
import { Lane } from "@/types/linetype";
import { useDebounce } from "@/hooks/useDebounce";

const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY ?? "";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export const updateCard = async (endpoint = "", updatedCard: Card) => {

//   const dbRef = ref(db, endpoint + updatedCard.id);

//   try {
//     await update(dbRef, { ...updatedCard });
//     return updatedCard;
//   } catch (error) {
//     console.error("error update", error);
//     return null;
//   }
// };

export const removeAllCardsThunk = createAsyncThunk(
  "data/deleteAllCards",
  async (_, thunkAPI) => {
    await apiDeleteRequestHandler("/cards/deleteAllCards");
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
    const data: Card[] = await fetch("/card.json").then((response) =>
      response.json()
    );

    const db = getDatabase();
    const updates: Updates = {};
    data.forEach((card: Card) => {
      // Generate a new key for each card
      const newCardKey = push(child(ref(db), "kanbanBoard/cards")).key;

      if (newCardKey === null) {
        console.error("Failed to generate a new key for a card");
        return; // Skip this iteration
      }

      card.id = newCardKey;
      updates["/kanbanBoard/cards/" + newCardKey] = card;
    });

    return await update(ref(db), updates)
      .then(() => {
        console.log("Synchronization succeeded");
      })

      .catch((error) => {
        console.error("Synchronization failed", error);
      });
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

// Thunk to fetch data by ID
// export const fetchCardIDThunk = createAsyncThunk<Card, number>(
//   "data/fetchById",
//   async (id, thunkAPI) => {
//     const data = await fetchData(`/kanbanBoard/cards/${id}`);
//     return data;
//   }
// );

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
  return "id" in obj && "name" in obj && "lane" in obj; // Bu örnek, Card tipini tanımlayan özelliklere göre düzenlenebilir
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
