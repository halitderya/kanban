import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface LaneData {
    height: number;
    width: number;
    offsetLeft: number;
  }
  
  export interface LanePositionState {
    lanes: {
      [laneId: number]: LaneData;
    };
  }

const initialState: LanePositionState = {
    lanes: {}
}

export const lanePositionSlice = createSlice({
  name: 'lanePosition',
  initialState,
  reducers: {


    addLane: (state, action: PayloadAction<{ laneId: number, laneData: LaneData }>) => {
        const { laneId, laneData } = action.payload;
        state.lanes[laneId] = laneData;  
    },
    updateLane: (state, action: PayloadAction<{ laneId: number, laneData: LaneData }>) => {
        const { laneId, laneData } = action.payload;
        if (state.lanes[laneId]) {
          state.lanes[laneId] = laneData;
        }
      },
      removeLane: (state, action: PayloadAction<number>) => {
        const laneId = action.payload;
        delete state.lanes[laneId];
      }
    },

  },
)

export const { addLane,removeLane,updateLane } = lanePositionSlice.actions

export default lanePositionSlice.reducer