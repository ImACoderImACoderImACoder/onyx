import { configureStore } from "@reduxjs/toolkit";
import deviceInformationReducer from "./features/deviceInformation/deviceInformationSlice";
import settingsReducer from "./features/settings/settingsSlice";

export default configureStore({
  reducer: {
    deviceInformation: deviceInformationReducer,
    settings: settingsReducer,
  },
});
