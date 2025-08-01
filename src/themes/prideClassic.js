import { prideClassicId } from "../constants/themeIds";

const buttonBackgroundColor = "#201c1c";

const pride = {
  author: "ImACoderImACoderImACoder",
  themeId: prideClassicId,
  buttonColorMain: buttonBackgroundColor,
  borderColor: "#D2D2D2",
  currentTemperatureColor: "#ed75b3",
  targetTemperatureColor: "#ed75b3",
  primaryFontColor: "white",
  plusMinusButtons: {
    backgroundColor: buttonBackgroundColor,
    borderColor: "#D2D2D2",
    color: "white",
  },
  buttonActive: {
    color: "white",
    backgroundColor: "black",
    borderColor: "darkviolet",
  },
  backgroundColor: "black",
  iconColor: "darkviolet",
  iconTextColor: "#ed75b3",
  temperatureRange: {
    lowTemperatureColor: "red",
    highTemperatureColor: "#ff5d7a",
    background: `linear-gradient(
        -90deg,
        rgba(255, 0, 0, 1) 0%,
        rgba(255, 154, 0, 1) 20%,
        rgba(208, 222, 33, 1) 30%,
        rgba(79, 220, 74, 1) 40%,
        rgba(63, 218, 216, 1) 50%,
        rgba(47, 201, 226, 1) 60%,
        rgba(28, 127, 238, 1) 70%,
        rgba(95, 21, 242, 1) 80%,
        rgba(186, 12, 248, 1) 90%,
        rgba(251, 7, 217, 1) 100%`,
    backgroundVertical: `linear-gradient(
        to top,
        rgba(251, 7, 217, 1) 0%,
        rgba(186, 12, 248, 1) 10%,
        rgba(95, 21, 242, 1) 20%,
        rgba(28, 127, 238, 1) 30%,
        rgba(47, 201, 226, 1) 40%,
        rgba(63, 218, 216, 1) 50%,
        rgba(79, 220, 74, 1) 60%,
        rgba(208, 222, 33, 1) 70%,
        rgba(255, 154, 0, 1) 80%,
        rgba(255, 0, 0, 1) 100%`,
    rangeBoxColor: "#ea379d",
    rangeBoxBorderColor: "white",
    rangeBackground: `linear-gradient(
      90deg,
      rgb(85, 205, 252) 0%, rgb(85, 205, 252) 20%,
      rgb(247, 168, 184) 20%, rgb(247, 168, 184) 40%,
      rgb(255, 255, 255) 40%, rgb(255, 255, 255) 60%,
      rgb(247, 168, 184) 60%, rgb(247, 168, 184) 80%,
      rgb(85, 205, 252) 80%, rgb(85, 205, 252) 100%)`,
  },
  workflowEditor: {
    accordionExpandedColor: "#2d3237",
  },
  ToggleButtons: {
    sliderBackgroundColorOff: "white",
    sliderBackgroundColorOn: `linear-gradient(180deg,rgb(209, 34, 41) 0% 16.77%,rgb(246, 138, 30) 16.77% 33.54%,rgb(253, 224, 26) 33.54% 50.31%,rgb(0, 121, 64) 50.31% 67.08%,rgb(36, 64, 142) 67.08% 83.85%,rgb(115, 41, 130) 83.85% 100%)`,
    sliderBorderColorOn: "#f8f9fa",
    onBackgroundColor:
      "linear-gradient(180deg,rgb(209, 34, 41) 0% 16.77%,rgb(246, 138, 30) 16.77% 33.54%,rgb(253, 224, 26) 33.54% 50.31%,rgb(0, 121, 64) 50.31% 67.08%,rgb(36, 64, 142) 67.08% 83.85%,rgb(115, 41, 130) 83.85% 100%)",
    onBorderColor: "gray",
    onColor: "white",
    offBackgroundColor: buttonBackgroundColor,
    offBorderColor: "white",
    offColor: "black",
  },
};

export default pride;
