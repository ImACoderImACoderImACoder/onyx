import { createSlice } from "@reduxjs/toolkit";
import { RE_INITIALIZE_STORE } from "../../constants/actions";

export const workflowSlice = createSlice({
  name: "workflow",
  initialState: {
    currentWorkflow: undefined,
    currentWorkflowStepId: undefined,
  },
  reducers: {
    setCurrentWorkflow: (state, action) => {
      state.currentWorkflow = action.payload;
    },
    setCurrentWorkflowStepId: (state, action) => {
      state.currentWorkflowStepId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RE_INITIALIZE_STORE, () => {
      return {
        currentWorkflow: undefined,
        currentWorkflowStepId: undefined,
      };
    });
  },
});

export const { setCurrentWorkflow, setCurrentWorkflowStepId } =
  workflowSlice.actions;

export default workflowSlice.reducer;
