import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    isF: undefined,
  },
  reducers: {
    setIsF: (state, action) => {
      state.isF = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setIsF } = settingsSlice.actions;

export default settingsSlice.reducer;
