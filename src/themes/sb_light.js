import { sb_lightThemeId } from "../constants/themeIds";

const backgroundColor = "#F6F6F6";
const fontColor = "#373737";

const buttonColor = "#373737";
const buttonTextColor = "#FFFFFF"

const primaryColor = "#FF6600";
const primaryTextColor = "#FFFFFF";

const secondaryColor = "#00287D";
const secondaryTextColor = "#FFFFFF"

const temperatureRangeLow = "#F53803";
const temperatureRangeHigh = "#F5D020";

const sb_light = {
  themeId: sb_lightThemeId,
  author: "mawize",
  borderStyle: "solid",
  borderColor: primaryColor,
  buttonColorMain: buttonColor,
  buttonFontColor: buttonTextColor,
  currentTemperatureColor: primaryColor,
  targetTemperatureColor: fontColor,
  buttonActive: {
    color: primaryTextColor,
    backgroundColor: primaryColor,
    borderColor: "white",
  },
  backgroundColor: backgroundColor,
  primaryFontColor: fontColor,
  iconColor: primaryColor,
  iconTextColor: secondaryColor,
  plusMinusButtons: {
    backgroundColor: secondaryColor,
    color: secondaryTextColor,
    borderColor: "white",
  },
  workflowEditor: {
    accordianExpandedColor: primaryColor,
  },
  temperatureRange: {
    lowTemperatureColor: temperatureRangeLow,
    highTemperatureColor: temperatureRangeHigh,
    background: "linear-gradient(315deg, "+temperatureRangeLow+" 0%, "+temperatureRangeHigh+" 74%)",
    rangeBoxColor: buttonColor,
    rangeBoxBorderColor: primaryColor,
  },
  ToggleButtons: {
    sliderBackgroundColorOn: primaryColor,
    sliderBackgroundColorOff: secondaryColor,
    sliderBorderColorOn: "#f8f9fa",
    onBackgroundColor: primaryColor,
    onBorderColor: "black",
    onColor: primaryTextColor,
    offBackgroundColor: secondaryColor,
    offBorderColor: "black",
    offColor: secondaryTextColor,
  },
};

export default sb_light;
