import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
  value: string
}

const initialState = { value: "" } satisfies SearchState as SearchState






const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {

    setSearch(state, action: PayloadAction<string>) {
      state.value = action.payload
    },
  },
})

export const { setSearch } = searchSlice.actions
export default searchSlice.reducer