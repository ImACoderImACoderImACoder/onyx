import { grayscaleId } from "../constants/themeIds";
import { createScaleTheme } from "./generators/scaleTheme";

const grayscale = createScaleTheme(
  grayscaleId,
  "#E4E6EB", // primaryColor - light gray for good contrast
  {
    backgroundColor: "#18191A",
    borderColor: "#3A3B3C",
    buttonColorMain: "#242526",
    currentTemperatureColor: "#B0B3B8",
    targetTemperatureColor: "#E4E6EB"
  }
);

// Override specific properties that differ from the scale pattern
Object.assign(grayscale, {
  iconColor: "#B0B3B8",
  iconTextColor: "#E4E6EB",
  buttonActive: {
    color: "#18191A",
    backgroundColor: "#E4E6EB",
    borderColor: "#E4E6EB",
  },
  ToggleButtons: {
    ...grayscale.ToggleButtons,
    sliderBackgroundColorOn: "#3A3B3C",
    onBackgroundColor: "#E4E6EB",
    onColor: "#18191A",
    offBackgroundColor: "#3A3B3C",
    offColor: "#E4E6EB",
  },
});

export default grayscale;
