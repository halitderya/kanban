import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {} from "../../../public/lanes.json"
import axios from "axios";
const initialState={

    lanes:[]
}
export const getLanes= createAsyncThunk("getLanes",async ()=>{


    const {data}= await axios.get("../../../public/lanes.json")
    return data
})
export const laneSlice= createSlice({

    name:"lane",
    initialState,
    reducers:{


    },
    extraReducers:(builder)=>{

        builder.addCase(getLanes.fulfilled,(state,action)=>{

            state.lanes=action.payload

        })

    }





})