import Snowfall from "react-snowfall";
import {
  christmasId,
  funId,
  christmasPeppermintHolidayId,
  aSuperSpecialAutoThemeSettingsId,
  feastOfSaintPatrickId,
  autumnBId,
} from "../../constants/themeIds";
import { useSelector } from "react-redux";
import GetTheme from "../../themes/ThemeProvider";
import GetAutoThemeId from "../../constants/themeDates";
import cloverSrc from "../../themes/festivities/stPatricksDay/clover.png";
import leafSrc1 from "../../themes/festivities/fall/leaves1.png";
import leafSrc2 from "../../themes/festivities/fall/leaves2.png";
import leafSrc3 from "../../themes/festivities/fall/leaves3.png";
import leafSrc4 from "../../themes/festivities/fall/leaves4.png";

import { useMemo } from "react";

const additionalSnowStyle = {
  zIndex: 9001,
};
export default function SnowfallWrapper() {
  const currentThemeId = useSelector(
    (state) => state.settings.config?.currentTheme || GetTheme().themeId
  );

  /* eslint-disable no-unused-vars */
  //little hack to make snow reaminate when these states change
  const currentTargetTemperature = useSelector(
    (state) => state.deviceInteraction.targetTemperature
  );

  const currentTemperature = useSelector(
    (state) => state.deviceInteraction.currentTemperature
  );
  /* eslint-enable no-unused-vars */

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

  const MemoClovers = useMemo(() => {
    const clover = new Image();
    clover.src = cloverSrc;
    const images = [clover];
    return <Snowfall images={images} radius={[40, 80]} snowflakeCount={20} />;
  }, []);

  const MemoLeaves = useMemo(() => {
    const leaf1 = new Image();
    leaf1.src = leafSrc1;

    const leaf2 = new Image();
    leaf2.src = leafSrc2;

    const leaf3 = new Image();
    leaf3.src = leafSrc3;

    const leaf4 = new Image();
    leaf4.src = leafSrc4;

    const images = [leaf1, leaf2, leaf3, leaf4];
    return <Snowfall images={images} radius={[40, 80]} snowflakeCount={15} />;
  }, []);

  const MemoDefaultSnow = useMemo(() => {
    return <Snowfall style={additionalSnowStyle} />;
  }, []);

  switch (
    currentThemeId === aSuperSpecialAutoThemeSettingsId
      ? GetAutoThemeId()
      : currentThemeId
  ) {
    case christmasId:
    case christmasPeppermintHolidayId:
      return MemoDefaultSnow;

    case funId:
      return (
        <Snowfall style={additionalSnowStyle} color={snowColor} />
        /*<Snowfall
          color={snowColor}
          wind={[-10, 10]}
          changeFrequency={100}
          snowflakeCount={200}
          speed={[1.0, 9.0]}
        />*/
      );
    case feastOfSaintPatrickId:
      return MemoClovers;
    case autumnBId:
      return MemoLeaves;
    default:
      return <></>;
  }
}
