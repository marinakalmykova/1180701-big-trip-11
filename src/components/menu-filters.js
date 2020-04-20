import AbstractComponent from "./abstract-component.js";

const createMenuFilterMarkup = (filter, isChecked) => {
  return (
    `<div class="trip-filters__filter">
                <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${isChecked ? `checked` : ``}>
                <label class="trip-filters__filter-label" for="filter-everything">${filter}</label>
              </div>`
  );
};

const createMenuFiltersTemplate = (menuFilters) => {
  const menuFiltersMarkup = menuFilters.map((it, i) => createMenuFilterMarkup(it, i === 0)).join(`\n`);
  return (
    `<form class="trip-filters" action="#" method="get">
              ${menuFiltersMarkup}
              <button class="visually-hidden" type="submit">Accept filter</button>
            </form>`
  );
};

export default class MenuFilters extends AbstractComponent {
  constructor(menuFilters) {
    super();
    this._menuFilters = menuFilters;
  }

  getTemplate() {
    return createMenuFiltersTemplate(this._menuFilters);
  }
}
