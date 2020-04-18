import {formatDateWithoutTime} from "../utils";

export const createTripDates = (tripEvents) => {
  let dateSet = new Set();
  tripEvents.forEach((tripEvent) => {
    const date = formatDateWithoutTime(tripEvent.dates[0]);
    dateSet.add(date);
  });
  return dateSet;
};

export const createDayTemplate = (date, index) => {
  return `<li class="trip-days__item  day" id="${index}">
              <div class="day__info">
                <span class="day__counter">${index + 1}</span>
                <time class="day__date" datetime="${date}">${date}</time>
              </div>
          </li>`;
};

