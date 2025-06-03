import { createSlice } from "@reduxjs/toolkit";
import { RE_INITIALIZE_STORE } from "../../constants/actions";
import {
  ReadConfigFromLocalStorage,
  WriteNewConfigToLocalStorage,
} from "../../services/utils";

export const workflowSlice = createSlice({
  name: "workflow",
  initialState: {
    currentWorkflow: undefined,
    currentWorkflowStepId: undefined,
    currentStepEllapsedTimeInSeconds: 0,
    lastWorkflowRunId:
      ReadConfigFromLocalStorage().workflows?.lastWorkflowRunId,
  },
  reducers: {
    setCurrentWorkflow: (state, action) => {
      state.currentWorkflow = action.payload;
      const newLastWorkFlowRunId =
        action.payload?.id || state.lastWorkflowRunId;
      if (newLastWorkFlowRunId !== state.lastWorkflowRunId) {
        state.lastWorkflowRunId = newLastWorkFlowRunId;
        const config = ReadConfigFromLocalStorage();
        config.workflows.lastWorkflowRunId = newLastWorkFlowRunId;
        WriteNewConfigToLocalStorage(config);
      }
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
        lastWorkflowRunId:
          ReadConfigFromLocalStorage().workflows?.lastWorkflowRunId,
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
