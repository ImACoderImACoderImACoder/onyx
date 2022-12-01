import { christmasPeppermintHolidayId } from "../../constants/themeIds";

const christmas = {
  author: "Princess Ariel",
  themeId: christmasPeppermintHolidayId,
  buttonColorMain: "#9E1F15",
  borderColor: "white",
  currentTemperatureColor: "#9E1F15",
  targetTemperatureColor: "#3C8123",
  primaryFontColor: "white",
  plusMinusButtons: {
    borderColor: "white",
    backgroundColor: "#9E1F15",
    color: "white",
  },
  buttonActive: {
    color: "white",
    backgroundColor: "#3C8123",
    borderColor: "white",
  },
  backgroundColor: "black",
  iconColor: "#3C8123",
  iconTextColor: "#9E1F15",
  temperatureRange: {
    background: `linear-gradient(
        -90deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(224, 48, 46, 1) 20%,
        rgba(255, 255, 255, 1)30%,
        rgba(60, 129, 35, 1) 40%,
        rgba(224, 48, 46, 1)50%,
        rgba(255, 255, 255, 1) 60%,
        rgba(60, 129, 35, 1) 70%,
        rgba(224, 48, 46, 1) 80%,
        rgba(255, 255, 255, 1) 90%,
        rgba(60, 129, 35, 1) 100%`,
    rangeBoxColor: "#9E1F15",
    rangeBoxBorderColor: "white",
    rangeBoxBorderRadius: "2rem",
    rangeBoxBorderWidth: "4px",
  },
  workflowEditor: {
    accordianExpandedColor: "#146B3A",
  },
  ToggleButtons: {
    sliderBackgroundColorOn: "#9E1F15",
    sliderBackgroundColorOff: "#3C8123",
    sliderBorderColor: "#f8f9fa",
    onBackgroundColor: "#3C8123",
    onBorderColor: "#BB2528",
    onColor: "#3C8123",
    offBackgroundColor: "#BB2528",
    offBorderColor: "#3C8123",
    offColor: "#9E1F15",
    backgroundImageOff: ` repeating-linear-gradient(    45deg,    transparent,    transparent 10px,    #3C8123 10px,    #3C8123 20px  ),  /* on "bottom" */  linear-gradient(    to bottom,    #eee,    #999  )`,
    backgroundImageColorOff: undefined,
    backgroundImageColorOn: undefined,
    backgroundImageOn: ` repeating-linear-gradient(    315deg,    transparent,    transparent 10px,    #E0302E 10px,    #E0302E 20px  ),  /* on "bottom" */  linear-gradient(    to bottom,    #eee,    #999  )`,
    backgroundBlendModeOff: "multiply",
    backgroundBlendModeOn: "multiply",
  },
};

export default christmas;
