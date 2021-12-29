import { createSlice } from "@reduxjs/toolkit";
import { ReadConfigFromLocalStorage } from "../../services/utils";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    isF: undefined,
    config: ReadConfigFromLocalStorage(),
  },
  reducers: {
    setIsF: (state, action) => {
      state.isF = action.payload;
    },
    setTemperatureControls: (state, action) => {
      state.config.temperatureControlValues = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setIsF, setTemperatureControls } = settingsSlice.actions;

export default settingsSlice.reducer;
