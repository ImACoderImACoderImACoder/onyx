import { createSlice } from "@reduxjs/toolkit";
import { RE_INITIALIZE_STORE } from "../../constants/actions";

export const connectionSlice = createSlice({
  name: "connection",
  initialState: {
    status: "disconnected", // 'connecting' | 'connected' | 'disconnected' | 'reconnecting'
    lastConnectedDevice: null,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    lastConnectionTime: null,
    autoReconnectEnabled: true,
    connectionQuality: "unknown", // 'excellent' | 'good' | 'poor' | 'unknown'
    lastError: null,
    isAutoConnecting: false,
    offlineQueueSize: 0,
    connectionHistory: [],
  },
  reducers: {
    setConnectionStatus: (state, action) => {
      const previousStatus = state.status;
      state.status = action.payload;
      
      // Track connection history
      if (previousStatus !== action.payload) {
        state.connectionHistory.push({
          status: action.payload,
          timestamp: Date.now(),
          previousStatus
        });
        
        // Keep only last 20 entries
        if (state.connectionHistory.length > 20) {
          state.connectionHistory.shift();
        }
      }
      
      // Reset attempts on successful connection
      if (action.payload === "connected") {
        state.reconnectAttempts = 0;
        state.lastConnectionTime = Date.now();
        state.isAutoConnecting = false;
        state.lastError = null;
      }
    },
    setLastConnectedDevice: (state, action) => {
      state.lastConnectedDevice = action.payload;
    },
    incrementReconnectAttempts: (state) => {
      state.reconnectAttempts += 1;
    },
    resetReconnectAttempts: (state) => {
      state.reconnectAttempts = 0;
    },
    setAutoReconnectEnabled: (state, action) => {
      state.autoReconnectEnabled = action.payload;
    },
    setConnectionQuality: (state, action) => {
      state.connectionQuality = action.payload;
    },
    setLastError: (state, action) => {
      state.lastError = action.payload;
    },
    setIsAutoConnecting: (state, action) => {
      state.isAutoConnecting = action.payload;
    },
    setOfflineQueueSize: (state, action) => {
      state.offlineQueueSize = action.payload;
    },
    setMaxReconnectAttempts: (state, action) => {
      state.maxReconnectAttempts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RE_INITIALIZE_STORE, (state) => {
      // Preserve auto-reconnect settings and device info across store reinitialization
      return {
        ...state,
        status: "connected",
        reconnectAttempts: 0,
        lastConnectionTime: Date.now(),
        isAutoConnecting: false,
        lastError: null,
        offlineQueueSize: 0,
      };
    });
  },
});

// Action creators
export const {
  setConnectionStatus,
  setLastConnectedDevice,
  incrementReconnectAttempts,
  resetReconnectAttempts,
  setAutoReconnectEnabled,
  setConnectionQuality,
  setLastError,
  setIsAutoConnecting,
  setOfflineQueueSize,
  setMaxReconnectAttempts,
} = connectionSlice.actions;

export default connectionSlice.reducer;