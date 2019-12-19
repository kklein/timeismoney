var Utils = (function () {

  return {
    // Map date to ISO weeknumber.
    getWeekId: function(date) {
        const dateCopy = new Date(date.valueOf());
        // ISO weeks start on Mondays.
        const dayNumber = (date.getDay() + 6) % 7;
        // Set the target to the Thursday of this week so the
        // target date is in the right year.
        dateCopy.setDate(dateCopy.getDate() - dayNumber + 3);
        // ISO 8601: Week 1 iff January 4th in it.
        const dateJan4 = new Date(dateCopy.getFullYear(), 0, 4);
        // Number of days between target date and january 4th
        const dayDiff = (dateCopy - dateJan4) / 86400000;
        // Calculate week number: Week 1 (january 4th) plus the
        // number of weeks between target date and january 4th
        const weekId = dateCopy.getFullYear().toString() +
            (1 + Math.ceil(dayDiff / 7)).toString();
        return parseInt(weekId);
    },

    getMonetaryValue: function(duration, hourlyWage) {
      return Math.round(duration / 60000 * 60) * hourlyWage / 3600;
    }
  };

})();
