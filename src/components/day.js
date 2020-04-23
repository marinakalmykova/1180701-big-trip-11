import AbstractComponent from "./abstract-component.js";
import {formatDateWithoutTime} from "../utils/common";

export const createTripDates = (tripEvents) => {
  let dateSet = new Set();
  tripEvents.forEach((tripEvent) => {
    const date = formatDateWithoutTime(tripEvent.dates[0]);
    dateSet.add(date);
  });
  return dateSet;
};

const createDayTemplate = (date, index) => {
  return `<li class="trip-days__item  day" id="${index}">
         <div class="day__info"></div>
          </li>`;
};

export default class Day extends AbstractComponent {
  constructor(day, index) {
    super();
    this._day = day;
    this._index = index;
  }

  getTemplate() {
    return createDayTemplate(this._day, this._index);
  }
}

