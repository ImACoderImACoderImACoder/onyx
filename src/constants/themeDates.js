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

export const isValentinesThemeDateRange = isInDateRange(
  new Date(),
  new Date("02/14"),
  new Date("02/07"),
  new Date("02/21")
);
