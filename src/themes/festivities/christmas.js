import { christmasId } from "../../constants/themeIds";

const christmas = {
  author: "ImACoderImACoderImACoder",
  themeId: christmasId,
  buttonColorMain: "#146B3A",
  borderColor: "#BB2528",
  currentTemperatureColor: "#BB2528",
  targetTemperatureColor: "#146B3A",
  primaryFontColor: "white",
  plusMinusButtons: {
    borderColor: "#BB2528",
    backgroundColor: "#146B3A",
    color: "white",
  },
  buttonActive: {
    color: "white",
    backgroundColor: "#BB2528",
    borderColor: "white",
  },
  backgroundColor: "black",
  iconColor: "#165B33",
  iconTextColor: "white",
  temperatureRange: {
    background: `linear-gradient(
        -90deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(187, 37, 40, 1) 20%,
        rgba(255, 255, 255, 1)30%,
        rgba(20, 107, 58, 1) 40%,
        rgba(187, 37, 40, 1) 50%,
        rgba(255, 255, 255, 1) 60%,
        rgba(20, 107, 58, 1) 70%,
        rgba(187, 37, 40, 1) 80%,
        rgba(255, 255, 255, 1) 90%,
        rgba(20, 107, 58, 1) 100%`,
    rangeBoxColor: "#146B3A",
    rangeBoxBorderColor: "#BB2528",
  },
  workflowEditor: {
    accordionExpandedColor: "#146B3A",
  },
  ToggleButtons: {
    sliderBackgroundColorOn: "beige",
    sliderBackgroundColorOff: "#146B3A",
    sliderBorderColorOn: "#f8f9fa",
    onBackgroundColor: "#146B3A",
    onBorderColor: "#BB2528",
    onColor: "white",
    offBackgroundColor: "#BB2528",
    offBorderColor: "#146B3A",
    offColor: "white",
    backgroundImageOff:
      "repeating-linear-gradient(45deg, black,black 5px, crimson 5px, crimson 25px,forestgreen 25px,forestgreen 30px),repeating-linear-gradient(-45deg,black,black 5px,black 5px,black 35px,forestgreen 35px,forestgreen 42px);",
    backgroundImageColorOff: undefined,
    backgroundImageColorOn: undefined,
    backgroundImageOn: `
    repeating-linear-gradient(
		to top left,
		wheat 0,
		wheat 20px,
		transparent 20px,
		transparent 40px,
		forestgreen 40px,
		forestgreen 60px
	),
	repeating-linear-gradient(
		to left,
		crimson 0,
		crimson 20px,
		wheat 20px,
		wheat 40px,
		forestgreen 40px,
		forestgreen 60px
	)`,
    backgroundBlendModeOff: "screen",
    backgroundBlendModeOn: "multiply",
  },
};

export default christmas;
