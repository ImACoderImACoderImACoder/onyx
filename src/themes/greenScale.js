import { greenscaleId } from "../constants/themeIds";
import { createScaleTheme } from "./generators/scaleTheme";

const greenscale = createScaleTheme(greenscaleId, "#0fca06", {
  borderColor: "#B0B3B8",
  gradientEndColor: "#B0B3B8"
});

// Override specific properties
Object.assign(greenscale.temperatureRange, {
  rangeBoxBorderColor: "white",
});

Object.assign(greenscale.plusMinusButtons, {
  borderColor: "#B0B3B8",
});

Object.assign(greenscale.ToggleButtons, {
  offBorderColor: "#B0B3B8",
});

export default greenscale;
