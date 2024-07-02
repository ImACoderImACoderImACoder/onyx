import { darkThemeId } from "../constants/themeIds";

const buttonBackgroundColor = "#242526";
const dark = {
  themeId: darkThemeId,
  buttonColorMain: buttonBackgroundColor,
  borderColor: "darkgray",
  buttonActive: {
    color: "darkviolet",
    backgroundColor: buttonBackgroundColor,
    borderColor: "darkviolet",
  },
  plusMinusButtons: {
    backgroundColor: buttonBackgroundColor,
    borderColor: "darkgray",
  },
  backgroundColor: "black",
  primaryFontColor: "antiquewhite",
  iconColor: "darkviolet",
  temperatureRange: {
    lowTemperatureColor: "#f53803",
    highTemperatureColor: "#f5d020",
    background: "linear-gradient(315deg, #f53803 0%, #f5d020 74%)",
    rangeBoxColor: "black",
    rangeBoxBorderColor: "orange",
  },
  workflowEditor: {
    accordianExpandedColor: "darkgray",
  },
  ToggleButtons: {
    sliderBackgroundColorOn: "lightgray",
    sliderBorderColorOn: "#f8f9fa",
    onBackgroundColor: buttonBackgroundColor,
    onBorderColor: "darkviolet",
    onColor: "#fff",
    offBackgroundColor: buttonBackgroundColor,
    offBorderColor: "darkgray",
    offColor: "#fff",
  },
};

export default dark;
