import { createSlice } from "@reduxjs/toolkit";
import { ReadConfigFromLocalStorage } from "../../services/utils";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    isF: undefined,
    config: ReadConfigFromLocalStorage(),
    isVibrationEnabled: undefined,
    isDisplayOnCooling: undefined,
    LEDbrightness: undefined,
  },
  reducers: {
    setIsF: (state, action) => {
      state.isF = action.payload;
    },
    setTemperatureControls: (state, action) => {
      state.config.temperatureControlValues = action.payload;
    },
    setIsVibrationEnabled: (state, action) => {
      state.isVibrationEnabled = action.payload;
    },
    setIsDisplayOnCooling: (state, action) => {
      state.isDisplayOnCooling = action.payload;
    },
    setLEDbrightness: (state, action) => {
      state.LEDbrightness = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setIsF,
  setTemperatureControls,
  setIsVibrationEnabled,
  setIsDisplayOnCooling,
  setLEDbrightness,
} = settingsSlice.actions;

export default settingsSlice.reducer;
