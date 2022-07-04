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
  plusMinusButtons: {
    backgroundColor: "#e79fec",
    color: "white",
    borderColor: "inherit",
  },
  temperatureRange: {
    background: "linear-gradient(315deg, #e79fec 0%, #fccddf 74%)",
    rangeBoxColor: "white",
    rangeBoxBorderColor: "#fccddf",
  },
  workflowEditor: {
    accordianExpandedColor: "darkgray",
  },
  ToggleButtons: {
    sliderBackgroundColorOn: "white",
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
