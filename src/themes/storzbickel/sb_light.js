import { sb_lightThemeId } from "../../constants/themeIds";
import { ReactComponent as VolcanoLogo } from './logo-v.svg';


const backgroundColor = "#F6F6F6";
const defaultTextColor = "#373737";

const buttonColor = "#373737";
const buttonTextColor = "#F6F6F6"

const primaryColor = "#FF6600";
const primaryTextColor = "#F6F6F6";

const secondaryColor = "#00287D";
const secondaryTextColor = "#F6F6F6"

const temperatureRangeLow = "#F53803";
const temperatureRangeHigh = "#F5D020";

const sb_light = {
  themeId: sb_lightThemeId,
  author: "mawize",
  logo: VolcanoLogo,
  borderStyle: "solid",
  borderColor: primaryColor,
  buttonColorMain: buttonColor,
  buttonFontColor: buttonTextColor,
  currentTemperatureColor: primaryColor,
  targetTemperatureColor: defaultTextColor,
  buttonActive: {
    color: primaryTextColor,
    backgroundColor: primaryColor,
    borderColor: "#FF00FF",
  },
  backgroundColor: backgroundColor,
  primaryFontColor: defaultTextColor,
  iconColor: primaryColor,
  iconTextColor: secondaryColor,
  plusMinusButtons: {
    backgroundColor: secondaryColor,
    color: secondaryTextColor,
    borderColor: "#FF00FF",
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
    sliderBorderColorOn: "#FF00FF",
    onBackgroundColor: primaryColor,
    onBorderColor: "#FF00FF",
    onColor: primaryTextColor,
    offBackgroundColor: secondaryColor,
    offBorderColor: "#FF00FF",
    offColor: secondaryTextColor,
  },
};

export default sb_light;
