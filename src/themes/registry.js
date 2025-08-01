import * as themeIds from "../constants/themeIds";
import GetAutoThemeId from "../constants/themeDates";

// Theme registry with lazy loading
const THEME_REGISTRY = new Map([
  [themeIds.darkThemeId, () => import("./dark")],
  [themeIds.lightThemeId, () => import("./light")],
  [themeIds.volcanicAshId, () => import("./volcanicAsh")],
  [themeIds.valentinesDayId, () => import("./festivities/ValentinesDay")],
  [themeIds.flamingoId, () => import("./flamingo")],
  [themeIds.grayscaleId, () => import("./grayScale")],
  [themeIds.redScaleId, () => import("./redScale")],
  [themeIds.purpleScaleId, () => import("./purpleScale")],
  [themeIds.greenscaleId, () => import("./greenScale")],
  [themeIds.prideClassicId, () => import("./prideClassic")],
  [themeIds.prideVibrantId, () => import("./prideVibrant")],
  [themeIds.funId, () => import("./fun")],
  [themeIds.halloweenId, () => import("./festivities/halloween")],
  [themeIds.christmasId, () => import("./festivities/christmas")],
  [themeIds.christmasWithoutSnowId, () => import("./festivities/christmas")],
  [themeIds.christmasPeppermintHolidayId, () => import("./festivities/peppermintHoliday")],
  [themeIds.feastOfSaintPatrickId, () => import("./festivities/stPatricksDay/stPatricksDay")],
  [themeIds.autumnBId, () => import("./festivities/fall/autumnB")]
]);

// Cache for loaded themes
const themeCache = new Map();

export const getThemeLoader = (themeId) => {
  return THEME_REGISTRY.get(themeId) || THEME_REGISTRY.get(GetAutoThemeId());
};

export const isValidThemeId = (themeId) => {
  return THEME_REGISTRY.has(themeId) || themeId === themeIds.aSuperSpecialAutoThemeSettingsId;
};

export const getAllThemeIds = () => {
  return Array.from(THEME_REGISTRY.keys());
};

export const loadTheme = async (themeId) => {
  // Handle auto theme selection
  if (themeId === themeIds.aSuperSpecialAutoThemeSettingsId) {
    themeId = GetAutoThemeId();
  }

  // Check cache first
  if (themeCache.has(themeId)) {
    return themeCache.get(themeId);
  }

  // Load theme
  const loader = getThemeLoader(themeId);
  if (!loader) {
    console.warn(`Theme ${themeId} not found, falling back to auto theme`);
    return loadTheme(GetAutoThemeId());
  }

  try {
    const themeModule = await loader();
    const theme = themeModule.default;
    
    // Cache the loaded theme
    themeCache.set(themeId, theme);
    
    return theme;
  } catch (error) {
    console.error(`Failed to load theme ${themeId}:`, error);
    // Fallback to auto theme if loading fails
    return loadTheme(GetAutoThemeId());
  }
};

export const clearThemeCache = () => {
  themeCache.clear();
};