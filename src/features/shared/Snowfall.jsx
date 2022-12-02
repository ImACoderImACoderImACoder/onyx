import Snowfall from "react-snowfall";
import {
  christmasId,
  funId,
  christmasPeppermintHolidayId,
  aSuperSpecialAutoThemeSettingsId,
} from "../../constants/themeIds";
import { useSelector } from "react-redux";
import GetTheme from "../../themes/ThemeProvider";
import GetAutoThemeId from "../../constants/themeDates";

export default function SnowfallWrapper() {
  const currentThemeId = useSelector(
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

  switch (
    currentThemeId === aSuperSpecialAutoThemeSettingsId
      ? GetAutoThemeId()
      : currentThemeId
  ) {
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
