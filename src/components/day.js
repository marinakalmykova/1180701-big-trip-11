import {createElement, formatDateWithoutTime} from "../utils";

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
              <div class="day__info">
                <span class="day__counter">${index + 1}</span>
                <time class="day__date" datetime="${date}">${date}</time>
              </div>
          </li>`;
};

export default class Day {
  constructor(day, index) {
    this._day = day;
    this._index = index;
    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._day, this._index);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

