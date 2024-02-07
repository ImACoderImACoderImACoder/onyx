import { createSlice } from "@reduxjs/toolkit";
import { RE_INITIALIZE_STORE } from "../../constants/actions";
import {
  ReadConfigFromLocalStorage,
  WriteNewConfigToLocalStorage,
} from "../../services/utils";

function writeCurrentSessionCountToLocalStorage(count) {
  const config = ReadConfigFromLocalStorage();
  config.currentSessionCount = count;
  WriteNewConfigToLocalStorage(config);
}
export const deviceInteractionSlice = createSlice({
  name: "deviceInteraction",
  initialState: {
    currentTemperature: undefined,
    targetTemperature: undefined,
    isFanOn: undefined,
    isHeatOn: undefined,
    lastFanOnTimeStamp: undefined,
    currentSessionCount: ReadConfigFromLocalStorage().currentSessionCount,
  },
  reducers: {
    setCurrentTemperature: (state, action) => {
      state.currentTemperature = action.payload;
    },
    setTargetTemperature: (state, action) => {
      state.targetTemperature = action.payload;
    },
    setIsFanOn: (state, action) => {
      if (action.payload && !lastFanOnTimeStamp) {
        state.lastFanOnTimeStamp = Date.now();
      }
      if (!action.payload && state.isFanOn) {
        if (Date.now() - state.lastFanOnTimeStamp > 1000 * 15) {
          const newSessionCount = state.currentSessionCount
            ? state.currentSessionCount + 1
            : 1;
          writeCurrentSessionCountToLocalStorage(newSessionCount);
          state.currentSessionCount = newSessionCount;
        }
        state.lastFanOnTimeStamp = undefined;
      }

      state.isFanOn = action.payload;
    },
    setIsHeatOn: (state, action) => {
      state.isHeatOn = action.payload;
    },
    resetCurrentSessionCount: (state) => {
      state.currentSessionCount = 0;
      writeCurrentSessionCountToLocalStorage(0);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RE_INITIALIZE_STORE, () => {
      return {
        currentTemperature: undefined,
        targetTemperature: undefined,
        isFanOn: undefined,
        isHeatOn: undefined,
        lastFanOnTimeStamp: undefined,
        currentSessionCount: ReadConfigFromLocalStorage().currentSessionCount,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  setCurrentTemperature,
  setTargetTemperature,
  setIsFanOn,
  setIsHeatOn,
  lastFanOnTimeStamp,
  resetCurrentSessionCount,
} = deviceInteractionSlice.actions;

export default deviceInteractionSlice.reducer;
