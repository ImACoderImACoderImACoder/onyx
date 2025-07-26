export const createScaleTheme = (themeId, primaryColor, options = {}) => {
  const {
    author = "ImACoderImACoderImACoder/ayebizz",
    backgroundColor = "black",
    borderColor = "#C0C0C0",
    buttonColorMain = "#242526",
    gradientEndColor = null,
    currentTemperatureColor = primaryColor,
    targetTemperatureColor = null
  } = options;

  const gradientEnd = gradientEndColor || `${primaryColor}73`; // Add alpha for lighter variant
  
  return {
    author,
    themeId,
    borderStyle: "solid",
    buttonColorMain,
    currentTemperatureColor,
    targetTemperatureColor,
    borderColor,
    buttonActive: {
      color: "white",
      backgroundColor: primaryColor,
      borderColor: "white",
    },
    backgroundColor,
    primaryFontColor: primaryColor,
    iconColor: primaryColor,
    iconTextColor: primaryColor,
    temperatureRange: {
      lowTemperatureColor: "#f53803",
      highTemperatureColor: "#f5d020",
      background: `linear-gradient(315deg, ${primaryColor} 0%, ${gradientEnd} 74%)`,
      rangeBoxColor: primaryColor,
      rangeBoxBorderColor: borderColor,
      rangeBackground: undefined,
      rangeBoxBorderRadius: "0.25rem",
      rangeBoxBorderWidth: "3px",
    },
    plusMinusButtons: {
      backgroundColor: buttonColorMain,
      color: primaryColor,
      borderColor,
    },
    workflowEditor: {
      accordionExpandedColor: primaryColor,
    },
    ToggleButtons: {
      sliderBackgroundColorOn: primaryColor,
      sliderBackgroundColorOff: "#B0B3B8",
      sliderBorderColorOn: "#f8f9fa",
      sliderBorderColorOff: "#f8f9fa",
      onBackgroundColor: primaryColor,
      onBorderColor: "white",
      onColor: "white",
      offBackgroundColor: buttonColorMain,
      offBorderColor: borderColor,
      offColor: primaryColor,
      backgroundImageOn: undefined,
      backgroundImageOff: undefined,
      backgroundBlendModeOn: "unset",
      backgroundBlendModeOff: "unset",
    },
  };
};