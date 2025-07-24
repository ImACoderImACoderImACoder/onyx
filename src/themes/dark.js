import { darkThemeId } from "../constants/themeIds";

const buttonBackgroundColor = "#242526";
const dark = {
  author: "ImACoderImACoderImACoder",
  themeId: darkThemeId,
  borderStyle: "solid",
  buttonColorMain: buttonBackgroundColor,
  borderColor: "darkgray",
  currentTemperatureColor: "antiquewhite",
  targetTemperatureColor: "antiquewhite",
  buttonActive: {
    color: "darkviolet",
    backgroundColor: buttonBackgroundColor,
    borderColor: "darkviolet",
  },
  plusMinusButtons: {
    backgroundColor: buttonBackgroundColor,
    color: "inherit",
    borderColor: "darkgray",
  },
  backgroundColor: "black",
  primaryFontColor: "antiquewhite",
  iconColor: "darkviolet",
  iconTextColor: "darkviolet",
  temperatureRange: {
    lowTemperatureColor: "#f53803",
    highTemperatureColor: "#f5d020",
    background: "linear-gradient(315deg, #f53803 0%, #f5d020 74%)",
    rangeBoxColor: "black",
    rangeBoxBorderColor: "orange",
    rangeBackground: undefined,
    rangeBoxBorderRadius: "0.25rem",
    rangeBoxBorderWidth: "3px",
  },
  workflowEditor: {
    accordionExpandedColor: "darkgray",
  },
  ToggleButtons: {
    sliderBackgroundColorOn: "lightgray",
    sliderBackgroundColorOff: undefined,
    sliderBorderColorOn: "#f8f9fa",
    sliderBorderColorOff: "#f8f9fa",
    onBackgroundColor: buttonBackgroundColor,
    onBorderColor: "darkviolet",
    onColor: "#fff",
    offBackgroundColor: buttonBackgroundColor,
    offBorderColor: "darkgray",
    offColor: "#fff",
    backgroundImageOn: undefined,
    backgroundImageOff: undefined,
    backgroundBlendModeOn: "unset",
    backgroundBlendModeOff: "unset",
  },
};

export default dark;
