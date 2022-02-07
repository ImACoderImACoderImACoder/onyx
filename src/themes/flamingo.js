import { flamingoId } from "../constants/themeIds";

const flamingo = {
  themeId: flamingoId,
  author: "Alexis",
  borderStyle: "solid",
  borderColor: "darkgray",
  buttonColorMain: "#e79fec",
  currentTemperatureColor: "antiquewhite",
  targetTemperatureColor: "antiquewhite",
  buttonActive: {
    color: "white",
    backgroundColor: "#fccddf",
    borderColor: "darkgray",
  },
  backgroundColor: "black",
  primaryFontColor: "white",
  iconColor: "#e8d6ed",
  iconTextColor: "#e8d6ed",
  settingsPageColor: "antiquewhite",
  deviceInformationPageColor: "antiquewhite",
  homePageColor: "antiquewhite",
  plusMinusButtons: {
    backgroundColor: "#e79fec",
    color: "white",
    borderColor: "inherit",
  },
  temperatureRange: {
    lowTemperatureColor: "#e79fec",
    highTemperatureColor: "#fccddf",
    rangeBoxColor: "white",
    rangeBoxBorderColor: "#fccddf",
  },
  ToggleButtons: {
    sliderBackgroundColor: "white",
    sliderBorderColor: "#white",
    onBackgroundColor: "#e79fec",
    onBorderColor: "#e79fec",
    onColor: "#fff",
    offBackgroundColor: "#fccddf",
    offBorderColor: "#fccddf",
    offColor: "#fff",
  },
};

export default flamingo;
