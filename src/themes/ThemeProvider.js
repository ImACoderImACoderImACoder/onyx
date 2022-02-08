import * as themeIds from "../constants/themeIds";
import dark from "./dark";
import light from "./light";
import valentinesDay from "./festivities/ValentinesDay";
import flamingo from "./flamingo";
import base from "./base";
import merge from "lodash/merge";
import grayscale from "./grayScale";

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
    default: {
      return deepMergeWithBase(dark);
    }
  }
}
