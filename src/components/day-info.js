import AbstractComponent from "./abstract-component.js";

const createDayInfoTemplate = (day, index) => {
  return `<div>
            <span class="day__counter">${index + 1}</span>
            <time class="day__date" datetime="${day}">${day}</time>
          </div>`;
};

export default class DayInfo extends AbstractComponent {
  constructor(day, index) {
    super();
    this._day = day;
    this._index = index;
  }

  getTemplate() {
    return createDayInfoTemplate(this._day, this._index);
  }
}

