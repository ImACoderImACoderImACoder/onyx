import { redScaleId } from "../constants/themeIds";
import { createScaleTheme } from "./generators/scaleTheme";

const redscale = createScaleTheme(redScaleId, "#d32f2f", {
  gradientEndColor: "#e57373"
});

// Override specific properties for better red theme visibility
Object.assign(redscale, {
  primaryFontColor: "#f44336", // Brighter red for better visibility
  iconColor: "#f44336",
  iconTextColor: "#f44336",
});

Object.assign(redscale.buttonActive, {
  backgroundColor: "#b71c1c", // Darkened red for active state
});

Object.assign(redscale.ToggleButtons, {
  offColor: "#d32f2f",
});

export default redscale;
