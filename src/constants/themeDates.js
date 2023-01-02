import * as themeIds from "./themeIds";

function isInDateRange(date, festivityDate, dateLowerBound, dateUpperBound) {
  if (date.getMonth() !== festivityDate.getMonth()) {
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
      new Date(`02/14/${currentYear}`),
      new Date(`02/07/${currentYear}`),
      new Date(`02/21/${currentYear}`)
    )
  ) {
    return themeIds.valentinesDayId;
  }

  if (
    isInDateRange(
      currentDate,
      new Date(`10/31/${currentYear}`),
      new Date(`10/01/${currentYear}`),
      new Date(`10/31/${currentYear}`)
    ) ||
    isInDateRange(
      currentDate,
      new Date(`11/01/${currentYear}`),
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
      new Date(`06/01/${currentYear}`),
      new Date(`06/31/${currentYear}`)
    )
  ) {
    return Math.floor(Math.random() * 2)
      ? themeIds.prideClassicId
      : themeIds.prideVibrantId;
  }
  if (
    isInDateRange(
      currentDate,
      new Date(`12/25/${currentYear}`),
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

  const themeKeys = Object.keys(themeIds).filter(
    (key) =>
      themeIds[key] !== themeIds.aSuperSpecialAutoThemeSettingsId &&
      themeIds[key] !== themeIds.christmasId &&
      themeIds[key] !== themeIds.christmasPeppermintHolidayId &&
      themeIds[key] !== themeIds.christmasWithoutSnowId &&
      themeIds[key] !== themeIds.valentinesDayId &&
      themeIds[key] !== themeIds.flamingoId &&
      themeIds[key] !== themeIds.funId &&
      themeIds[key] !== themeIds.prideClassicId &&
      themeIds[key] !== themeIds.prideVibrantId &&
      themeIds[key] !== themeIds.lightThemeId &&
      themeIds[key] !== themeIds.halloweenId
  );
  randomTheme =
    themeIds[themeKeys[Math.floor(Math.random() * themeKeys.length)]];
  return randomTheme;
}
