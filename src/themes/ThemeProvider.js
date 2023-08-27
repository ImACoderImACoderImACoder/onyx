import * as themeIds from "../constants/themeIds";
import dark from "./dark";
import light from "./light";
import valentinesDay from "./festivities/ValentinesDay";
import flamingo from "./flamingo";
import base from "./base";
import merge from "lodash/merge";
import grayscale from "./grayScale";
import prideClassic from "./prideClassic";
import prideVibrant from "./prideVibrant";
import greenscale from "./greenScale";
import fun from "./fun";
import halloween from "./festivities/halloween";
import volcanicAsh from "./volcanicAsh";
import christmas from "./festivities/christmas";
import stPatricksDay from "./festivities/stPatricksDay/stPatricksDay";
import peppermintHoliday from "./festivities/peppermintHoliday";
import GetAutoThemeId from "../constants/themeDates";

const deepMergeWithBase = (theme) => merge(base(), { ...theme });

export default function GetTheme(type) {
  switch (type) {
    case themeIds.darkThemeId:
      return deepMergeWithBase(dark);
    case themeIds.lightThemeId:
      return deepMergeWithBase(light);
    case themeIds.volcanicAshId:
      return deepMergeWithBase(volcanicAsh);
    case themeIds.valentinesDayId:
      return deepMergeWithBase(valentinesDay);
    case themeIds.flamingoId:
      return deepMergeWithBase(flamingo);
    case themeIds.grayscaleId:
      return deepMergeWithBase(grayscale);
    case themeIds.greenscaleId:
      return deepMergeWithBase(greenscale);
    case themeIds.prideClassicId:
      return deepMergeWithBase(prideClassic);
    case themeIds.prideVibrantId:
      return deepMergeWithBase(prideVibrant);
    case themeIds.funId:
      return deepMergeWithBase(fun);
    case themeIds.halloweenId:
      return deepMergeWithBase(halloween);
    case themeIds.christmasId:
    case themeIds.christmasWithoutSnowId:
      return deepMergeWithBase(christmas);
    case themeIds.christmasPeppermintHolidayId:
      return deepMergeWithBase(peppermintHoliday);
    case themeIds.aSuperSpecialAutoThemeSettingsId:
      return GetTheme(GetAutoThemeId());
    case themeIds.feastOfSaintPatrickId:
      return deepMergeWithBase(stPatricksDay);
    default: {
      return GetTheme(GetAutoThemeId());
    }
  }
}
