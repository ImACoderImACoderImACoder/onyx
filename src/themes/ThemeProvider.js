export default function GetTheme(type) {
  switch (type) {
    case "dark":
      return {
        buttonColorMain: "black",
        backgroundColor: "black",
        primaryFontColor: "antiquewhite",
        iconColor: "rebeccapurple",
        temperatureRange: {
          lowTemperatureColor: "#f53803",
          highTemperatureColor: "#f5d020",
          rangeBoxColor: "black",
          rangeBoxBorderColor: "orange",
        },
      };
    case "light":
      return {
        buttonColorMain: "white",
        backgroundColor: "white",
        primaryFontColor: "black",
        iconColor: "blue",
        temperatureRange: {
          lowTemperatureColor: "#f53803",
          highTemperatureColor: "#f5d020",
          rangeBoxColor: "black",
          rangeBoxBorderColor: "orange",
        },
      };
    default: {
      return {
        buttonColorMain: "black",
        backgroundColor: "black",
        primaryFontColor: "antiquewhite",
        iconColor: "rebeccapurple",
        temperatureRange: {
          lowTemperatureColor: "#f53803",
          highTemperatureColor: "#f5d020",
          rangeBoxColor: "black",
          rangeBoxBorderColor: "orange",
        },
      };
    }
  }
}
