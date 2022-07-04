import { darkThemeId } from "../constants/themeIds";

const dark = {
  themeId: darkThemeId,
  buttonColorMain: "black",
  borderColor: "darkgray",
  buttonActive: {
    color: "white",
    backgroundColor: "black",
    borderColor: "darkviolet",
  },
  plusMinusButtons: {
    backgroundColor: "black",
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
    sliderBorderColor: "#f8f9fa",
    onBackgroundColor: "black",
    onBorderColor: "darkviolet",
    onColor: "#fff",
    offBackgroundColor: "black",
    offBorderColor: "darkgray",
    offColor: "#fff",
  },
};

export default dark;
