import Snowfall from "react-snowfall";
import {
  christmasId,
  funId,
  christmasPeppermintHolidayId,
} from "../../constants/themeIds";
import { useSelector } from "react-redux";
import GetTheme from "../../themes/ThemeProvider";

export default function SnowfallWrapper() {
  const theme = useSelector(
    (state) => state.settings.config?.currentTheme || GetTheme().themeId
  );

  const snowColorOptions = [
    "#FF0000",
    "#FFA500",
    "#FFFF00",
    "#00FF00",
    "#004efd",
    "#7f00ff",
    "#FFFFFF",
  ];
  const snowColor =
    snowColorOptions[Math.floor(Math.random() * snowColorOptions.length)];

  switch (theme) {
    case christmasId:
    case christmasPeppermintHolidayId:
      return <Snowfall />;
    case funId:
      return (
        <Snowfall color={snowColor} />
        /*<Snowfall
          color={snowColor}
          wind={[-10, 10]}
          changeFrequency={100}
          snowflakeCount={200}
          speed={[1.0, 9.0]}
        />*/
      );
    default:
      return <></>;
  }
}
