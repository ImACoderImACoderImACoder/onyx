import * as themeIds from "../constants/themeIds";
import dark from "./dark";
import light from "./light";
import valentinesDay from "./festivities/ValentinesDay";
import flamingo from "./flamingo";
import base from "./base";
import merge from "lodash/merge";
import { validateTheme } from "./validation";
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
import redscale from "./redScale";
import purplescale from "./purpleScale";
import autumnB from "./festivities/fall/autumnB";

const deepMergeWithBase = (theme) => {
  const mergedTheme = merge(base(), { ...theme });
  
  // Validate theme in development
  if (process.env.NODE_ENV === 'development') {
    validateTheme(mergedTheme);
  }
  
  return mergedTheme;
};

// Theme registry for O(1) lookup instead of switch statement
const THEME_REGISTRY = new Map([
  [themeIds.darkThemeId, dark],
  [themeIds.lightThemeId, light],
  [themeIds.volcanicAshId, volcanicAsh],
  [themeIds.valentinesDayId, valentinesDay],
  [themeIds.flamingoId, flamingo],
  [themeIds.grayscaleId, grayscale],
  [themeIds.redScaleId, redscale],
  [themeIds.purpleScaleId, purplescale],
  [themeIds.greenscaleId, greenscale],
  [themeIds.prideClassicId, prideClassic],
  [themeIds.prideVibrantId, prideVibrant],
  [themeIds.funId, fun],
  [themeIds.halloweenId, halloween],
  [themeIds.christmasId, christmas],
  [themeIds.christmasWithoutSnowId, christmas],
  [themeIds.christmasPeppermintHolidayId, peppermintHoliday],
  [themeIds.feastOfSaintPatrickId, stPatricksDay],
  [themeIds.autumnBId, autumnB]
]);

export default function GetTheme(type) {
  // Handle auto theme selection
  if (type === themeIds.aSuperSpecialAutoThemeSettingsId) {
    return GetTheme(GetAutoThemeId());
  }

  // Get theme from registry
  const theme = THEME_REGISTRY.get(type);
  if (theme) {
    return deepMergeWithBase(theme);
  }

  // Fallback to auto theme
  return GetTheme(GetAutoThemeId());
}
