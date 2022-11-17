import { configureStore } from "@reduxjs/toolkit";
import deviceInformationReducer from "./features/deviceInformation/deviceInformationSlice";
import deviceInteractionReducer from "./features/deviceInteraction/deviceInteractionSlice";
import settingsReducer from "./features/settings/settingsSlice";
import workflowReducer from "./features/workflowEditor/workflowSlice";

const store = configureStore({
  reducer: {
    deviceInformation: deviceInformationReducer,
    deviceInteraction: deviceInteractionReducer,
    settings: settingsReducer,
    workflow: workflowReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
