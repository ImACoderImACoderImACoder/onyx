import { grayscaleId } from "../constants/themeIds";

const grayscale = {
  themeId: grayscaleId,
  buttonColorMain: "#242526",
  borderColor: "#B0B3B8",
  buttonActive: {
    color: "white",
    backgroundColor: "#AAAAAA",
    borderColor: "black",
  },
  backgroundColor: "#18191A",
  primaryFontColor: "#E4E6EB",
  iconColor: "#3A3B3C",
  iconTextColor: "#E4E6EB",
  temperatureRange: {
    background: "linear-gradient(315deg, #B0B3B8 0%, #242526 74%)",
    rangeBoxColor: "#242526",
    rangeBoxBorderColor: "#B0B3B8",
  },
  plusMinusButtons: {
    backgroundColor: "#242526",
    color: "#E4E6EB",
    borderColor: "#B0B3B8",
  },
  workflowEditor: {
    accordianExpandedColor: "#B0B3B8",
  },
  ToggleButtons: {
    sliderBackgroundColor: "#3A3B3C",
    sliderBorderColor: "#f8f9fa",
    onBackgroundColor: "#AAAAAA",
    onBorderColor: "#AAAAAA",
    onColor: "white",
    offBackgroundColor: "#242526",
    offBorderColor: "#242526",
    offColor: "#E4E6EB",
  },
};

export default grayscale;
