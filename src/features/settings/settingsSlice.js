import { createSlice } from "@reduxjs/toolkit";
import {
  ReadConfigFromLocalStorage,
  WriteNewConfigToLocalStorage,
} from "../../services/utils";
import { RE_INITIALIZE_STORE } from "../../constants/actions";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    isF: undefined,
    config: ReadConfigFromLocalStorage(),
    isVibrationEnabled: undefined,
    isDisplayOnCooling: undefined,
    LEDbrightness: undefined,
    autoShutoffTime: undefined,
    language: undefined,
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
    setAutoShutoffTime: (state, action) => {
      state.autoShutoffTime = action.payload;
    },
    setCurrentTheme: (state, action) => {
      state.config.currentTheme = action.payload;
    },
    setCurrentWorkflows: (state, action) => {
      state.config.workflows.items = action.payload;
    },
    setFanOnGlobal: (state, action) => {
      state.config.workflows.fanOnGlobal = action.payload;
    },
    setHighlightLastRunWorkflow: (state, action) => {
      state.config.highlightLastRunWorkflow = action.payload;
    },
    setIsMinimalistMode: (state, action) => {
      state.config.isMinimalistMode = action.payload;
      WriteNewConfigToLocalStorage(state.config);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      state.config.language = action.payload;
      WriteNewConfigToLocalStorage(state.config);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RE_INITIALIZE_STORE, (state) => {
      return {
        isF: undefined,
        isVibrationEnabled: undefined,
        isDisplayOnCooling: undefined,
        LEDbrightness: undefined,
        config: ReadConfigFromLocalStorage(),
        autoShutoffTime: undefined,
        language: undefined,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  setIsF,
  setTemperatureControls,
  setIsVibrationEnabled,
  setIsDisplayOnCooling,
  setLEDbrightness,
  setAutoShutoffTime,
  setCurrentTheme,
  setCurrentWorkflows,
  setFanOnGlobal,
  setHighlightLastRunWorkflow,
  setIsMinimalistMode,
  setLanguage,
} = settingsSlice.actions;

export default settingsSlice.reducer;
