import { createSlice } from "@reduxjs/toolkit";

export const lastAppRefreshSlice = createSlice({
  name: "lastAppRefresh",
  initialState: {
    appInitializedTimestamp: (() => {
      const currentdate = new Date();
      const dateTime =
        "Last Synced: " +
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " @ " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();
      return dateTime;
    })(),
  },
  reducers: {},
});

export default lastAppRefreshSlice.reducer;
