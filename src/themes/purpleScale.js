import { purpleScaleId } from "../constants/themeIds";
import { createScaleTheme } from "./generators/scaleTheme";

const purplescale = createScaleTheme(purpleScaleId, "#8e24aa", {
  gradientEndColor: "#ba68c8"
});

// Override specific properties for better purple theme visibility
Object.assign(purplescale, {
  primaryFontColor: "#9c27b0", // Slightly lighter purple for visibility
  iconColor: "#9c27b0",
  iconTextColor: "#9c27b0",
});

Object.assign(purplescale.buttonActive, {
  backgroundColor: "#6a1b9a", // Darker purple for active state
});

Object.assign(purplescale.ToggleButtons, {
  offColor: "#8e24aa",
});

export default purplescale;
