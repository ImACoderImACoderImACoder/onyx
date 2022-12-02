import Snowfall from "react-snowfall";
import {
  christmasId,
  funId,
  christmasPeppermintHolidayId,
} from "../../constants/themeIds";
import { useSelector } from "react-redux";
import GetTheme from "../../themes/ThemeProvider";
import { useState } from "react";
import { useEffect } from "react";

export default function SnowfallWrapper() {
  const [snowflakeCount, setSnowflakeCount] = useState(150);
  const [isSnowReducerRunning, setIsSnowReducerRunning] = useState(false);

  const isHeatOn = useSelector((state) => state.deviceInteraction.isHeatOn);

  const currentTargetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature
  );

  const currentTemperature = useSelector(
    (state) => state.deviceInteraction.currentTemperature
  );

  useEffect(() => {
    let intervalId;
    if (isSnowReducerRunning) {
      intervalId = setInterval(() => {
        reduceStorm();
      }, 400);
    }

    return () => clearInterval(intervalId);
  }, [isSnowReducerRunning]);

  const reduceStorm = () => {
    setSnowflakeCount((currentCount) => {
      const newSnowflakeCount = currentCount - 5;
      if (newSnowflakeCount < 10) return 10;
      return newSnowflakeCount;
    });
  };

  useEffect(() => {
    if (
      isHeatOn &&
      Math.abs(currentTargetTemperature - currentTemperature) > 5
    ) {
      setIsSnowReducerRunning(true);
    } else {
      setIsSnowReducerRunning(false);
      setSnowflakeCount(150);
    }
  }, [isHeatOn, currentTargetTemperature, currentTemperature]);

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
        <Snowfall color={snowColor} snowflakeCount={snowflakeCount} />
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
