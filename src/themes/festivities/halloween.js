import { halloweenId } from "../../constants/themeIds";

const volcanicAsh = {
  themeId: halloweenId,
  author: "Princess Ariel",
  borderStyle: "solid",
  borderColor: "#570CA0",
  buttonColorMain: "#242526",
  currentTemperatureColor: "#FF6600",
  targetTemperatureColor: "white",
  buttonActive: {
    color: "white",
    backgroundColor: "#FF6600",
    borderColor: "white",
  },
  backgroundColor: "black",
  primaryFontColor: "#32CD32",
  iconColor: "#FF6600",
  iconTextColor: "white",
  plusMinusButtons: {
    backgroundColor: "#242526",
    color: "#32CD32",
    borderColor: "FF6600",
  },
  workflowEditor: {
    accordionExpandedColor: "#FF6600",
  },
  temperatureRange: {
    lowTemperatureColor: "#f53803",
    highTemperatureColor: "#f5d020",
    background:
      "linear-gradient(90deg, rgba(87,12,160,1) 18%, rgba(50,205,50,1) 50%, rgba(255,102,0,1) 80%)",
    backgroundVertical:
      "linear-gradient(to top, rgba(255,102,0,1) 0%, rgba(50,205,50,1) 50%, rgba(87,12,160,1) 100%)",
    rangeBoxColor: "black",
    rangeBoxBorderColor: "#FF6600",
  },
  ToggleButtons: {
    sliderBackgroundColorOff: "#570CA0",
    sliderBackgroundColorOn: "#32CD32",
    sliderBorderColorOn: "#f8f9fa",
    onBackgroundColor: "#FF6600",
    onBorderColor: "white",
    onColor: "#fff",
    offBackgroundColor: "#570CA0",
    offBorderColor: "#32CD32",
    offColor: "#32CD32",
  },
};

export default volcanicAsh;
