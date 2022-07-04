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
import funId from "./fun";

const deepMergeWithBase = (theme) => merge(base(), { ...theme });

export default function GetTheme(type) {
  switch (type) {
    case themeIds.darkThemeId:
      return deepMergeWithBase(dark);
    case themeIds.lightThemeId:
      return deepMergeWithBase(light);
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
      return deepMergeWithBase(funId);
    default: {
      return deepMergeWithBase(dark);
    }
  }
}
