import { createSlice } from "@reduxjs/toolkit";
import { RE_INITIALIZE_STORE } from "../../constants/actions";

export const gamepadSlice = createSlice({
  name: "gamepadController",
  initialState: {
    crossIsPressed: {previous: false, current: false},
    squareIsPressed: {previous: false, current: false},
    circleIsPressed: {previous: false, current: false},
    r1IsPressed: {previous: false, current: false},
    l1IsPressed: {previous: false, current: false},
    upIsPressed: {previous: false, current: false},
    downIsPressed: {previous: false, current: false},
  },
  reducers: {
    setCrossIsPressed: (state, action) => {
      state.crossIsPressed = action.payload;
    },
    setSquareIsPressed: (state, action) => {
      state.squareIsPressed = action.payload;
    },
    setCircleIsPressed: (state, action) => {
      state.circleIsPressed = action.payload;
    },
    setR1IsPressed: (state, action) => {
      state.r1IsPressed = action.payload;
    },
    setL1IsPressed: (state, action) => {
      state.l1IsPressed = action.payload;
    },
    setUpIsPressed: (state, action) => {
      state.upIsPressed = action.payload;
    },
    setDownIsPressed: (state, action) => {
      state.downIsPressed = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RE_INITIALIZE_STORE, () => {
      return {
        crossIsPressed: {previous: false, current: false},
        squareIsPressed: {previous: false, current: false},
        circleIsPressed: {previous: false, current: false},
        r1IsPressed: {previous: false, current: false},
        l1IsPressed: {previous: false, current: false},
        upIsPressed: {previous: false, current: false},
        downIsPressed: {previous: false, current: false},
      };
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  setCrossIsPressed,
  setSquareIsPressed,
  setCircleIsPressed,
  setR1IsPressed,
  setL1IsPressed,
  setUpIsPressed,
  setDownIsPressed,
} = gamepadSlice.actions;

export default gamepadSlice.reducer;
