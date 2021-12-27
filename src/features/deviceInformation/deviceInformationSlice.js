import { createSlice } from "@reduxjs/toolkit";

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
  },
});

// Action creators are generated for each case reducer function
export const {
  setSerialNumber,
  setBleFirmwareVersion,
  setHoursOfOperation,
  setVolcanoFirmwareVersion,
} = deviceInformationSlice.actions;

export default deviceInformationSlice.reducer;
