import { createSlice } from "@reduxjs/toolkit";
import { RE_INITIALIZE_STORE } from "../../constants/actions";

export const workflowSlice = createSlice({
  name: "workflow",
  initialState: {
    currentWorkflow: undefined,
    currentWorkflowStepId: undefined,
    currentStepEllapsedTimeInSeconds: 0,
  },
  reducers: {
    setCurrentWorkflow: (state, action) => {
      state.currentWorkflow = action.payload;
    },
    setCurrentWorkflowStepId: (state, action) => {
      state.currentWorkflowStepId = action.payload;
      state.currentStepEllapsedTimeInSeconds = 0;
    },
    setCurrentStepEllapsedTimeInSeconds: (state, action) => {
      state.currentStepEllapsedTimeInSeconds = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RE_INITIALIZE_STORE, () => {
      return {
        currentWorkflow: undefined,
        currentWorkflowStepId: undefined,
        currentStepEllapsedTimeInSeconds: 0,
      };
    });
  },
});

export const {
  setCurrentWorkflow,
  setCurrentWorkflowStepId,
  setCurrentStepEllapsedTimeInSeconds,
} = workflowSlice.actions;

export default workflowSlice.reducer;
