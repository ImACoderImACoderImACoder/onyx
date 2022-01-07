import { createSlice } from "@reduxjs/toolkit";
import { RE_INITIALIZE_STORE } from "../../constants/actions";

export const deviceInformationSlice = createSlice({
  name: "deviceInformation",
  initialState: {
    serialNumber: undefined,
    bleFirmwareVersion: undefined,
    hoursOfOperation: {
      hours: undefined,
      lastUpdated: undefined,
    },
    volcanoFirmwareVersion: undefined,
    autoOffTimeInSeconds: 0,
  },
  reducers: {
    setSerialNumber: (state, action) => {
      state.serialNumber = action.payload;
    },
    setBleFirmwareVersion: (state, action) => {
      state.bleFirmwareVersion = action.payload;
    },
    setHoursOfOperation: (state, action) => {
      state.hoursOfOperation.hours = action.payload.hours;
      state.hoursOfOperation.lastUpdated = action.payload.lastUpdated;
    },
    setVolcanoFirmwareVersion: (state, action) => {
      state.volcanoFirmwareVersion = action.payload;
    },
    setAutoOffTimeInSeconds: (state, action) => {
      state.autoOffTimeInSeconds = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RE_INITIALIZE_STORE, () => {
      return {
        serialNumber: undefined,
        bleFirmwareVersion: undefined,
        hoursOfOperation: {
          hours: undefined,
          lastUpdated: undefined,
        },
        volcanoFirmwareVersion: undefined,
        autoOffTimeInSeconds: 0,
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  setSerialNumber,
  setBleFirmwareVersion,
  setHoursOfOperation,
  setVolcanoFirmwareVersion,
  setAutoOffTimeInSeconds,
} = deviceInformationSlice.actions;

export default deviceInformationSlice.reducer;
