import * as themeIds from "./themeIds";

function isInDateRange(date, dateLowerBound, dateUpperBound) {
  if (date.getMonth() !== dateLowerBound.getMonth()) {
    return false;
  }

  const currentDay = date.getDate();
  return (
    currentDay >= dateLowerBound.getDate() &&
    currentDay <= dateUpperBound.getDate()
  );
} //I think this is good enough for now.  obviously doesn't work with dates that cross months.
let randomTheme;
export default function GetAutoThemeId() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  if (
    isInDateRange(
      currentDate,
      new Date(`02/07/${currentYear}`),
      new Date(`02/21/${currentYear}`)
    )
  ) {
    return themeIds.valentinesDayId;
  }

  if (
    isInDateRange(
      currentDate,
      new Date(`03/04/${currentYear}`),
      new Date(`03/21/${currentYear}`)
    )
  ) {
    return themeIds.feastOfSaintPatrickId;
  }

  if (
    isInDateRange(
      currentDate,
      new Date(`09/22/${currentYear}`),
      new Date(`09/30/${currentYear}`)
    )
  ) {
    return themeIds.autumnBId;
  }

  if (
    isInDateRange(
      currentDate,
      new Date(`10/01/${currentYear}`),
      new Date(`10/31/${currentYear}`)
    ) ||
    isInDateRange(
      currentDate,
      new Date(`11/01/${currentYear}`),
      new Date(`11/01/${currentYear}`)
    )
  ) {
    return themeIds.halloweenId;
  }

  if (
    isInDateRange(
      currentDate,
      new Date(`06/01/${currentYear}`),
      new Date(`06/30/${currentYear}`)
    )
  ) {
    return Math.floor(Math.random() * 2)
      ? themeIds.prideClassicId
      : themeIds.prideVibrantId;
  }

  if (
    isInDateRange(
      currentDate,
      new Date(`12/01/${currentYear}`),
      new Date(`12/31/${currentYear}`)
    )
  ) {
    return Math.floor(Math.random() * 2)
      ? themeIds.christmasPeppermintHolidayId
      : themeIds.christmasId;
  }

  if (randomTheme) {
    return randomTheme;
  }

  const excludedThemes = new Set([
    themeIds.aSuperSpecialAutoThemeSettingsId,
    themeIds.christmasId,
    themeIds.christmasPeppermintHolidayId,
    themeIds.christmasWithoutSnowId,
    themeIds.valentinesDayId,
    themeIds.flamingoId,
    themeIds.funId,
    themeIds.prideClassicId,
    themeIds.prideVibrantId,
    themeIds.lightThemeId,
    themeIds.feastOfSaintPatrickId,
    themeIds.halloweenId,
    themeIds.autumnBId
  ]);
  
  const themeKeys = Object.keys(themeIds).filter(
    (key) => !excludedThemes.has(themeIds[key])
  );
  randomTheme =
    themeIds[themeKeys[Math.floor(Math.random() * themeKeys.length)]];
  return randomTheme;
}
