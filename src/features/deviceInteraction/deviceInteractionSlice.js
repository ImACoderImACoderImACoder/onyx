import { createSlice } from "@reduxjs/toolkit";

export const deviceInteractionSlice = createSlice({
  name: "deviceInteraction",
  initialState: {
    currentTemperature: undefined,
    targetTemperature: undefined,
    isFanOn: undefined,
    isFanToggleInProgress: false,
    isHeatOn: undefined,
  },
  reducers: {
    setCurrentTemperature: (state, action) => {
      state.currentTemperature = action.payload;
    },
    setTargetTemperature: (state, action) => {
      state.targetTemperature = action.payload;
      state.isFanToggleInProgress = false;
    },
    setIsFanOn: (state, action) => {
      state.isFanOn = action.payload;
    },
    setIsHeatOn: (state, action) => {
      state.isHeatOn = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCurrentTemperature,
  setTargetTemperature,
  setIsFanOn,
  setIsHeatOn,
} = deviceInteractionSlice.actions;

export default deviceInteractionSlice.reducer;
