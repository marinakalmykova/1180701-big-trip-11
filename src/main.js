import {createTripInfoTemplate} from "./components/trip-info.js";
import {createMenuControlsTemplate} from "./components/menu-controls.js";
import {createMenuFiltersTemplate} from "./components/menu-filters.js";
import {createTripSortingTemplate} from "./components/sorting.js";
import {createTripEventTemplate} from "./components/trip-event.js";
import {createTripListTemplate} from "./components/trip-list.js";
import {createDayListTemplate} from './components/day-list.js';
import {createDayTemplate} from "./components/day.js";
import {createItemTemplate} from "./components/item.js";

const ITEM_COUNT = 3;

const render = (container, template, place = `afterbegin`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.trip-main`);
const tripControlElement = document.querySelector(`.trip-controls`);
const tripMenuElement = tripControlElement.querySelector(`.trip-tabs`);
const tripFilterElement = tripControlElement.querySelector(`.trip-filters`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(siteMainElement, createTripInfoTemplate());
render(tripMenuElement, createMenuControlsTemplate(), `afterend`);
render(tripFilterElement, createMenuFiltersTemplate(), `afterend`);
render(tripEventsElement, createTripSortingTemplate());
render(tripEventsElement, createTripEventTemplate(), `beforeend`);
render(tripEventsElement, createTripListTemplate(), `beforeend`);
const tripListElement = tripEventsElement.querySelector(`.trip-days`);
render(tripListElement, createDayTemplate(), `afterbegin`);
const dayElement = tripListElement.querySelector(`.trip-days__item`);
render(dayElement, createDayListTemplate(), `beforeend`);
const dayListElement = dayElement.querySelector(`.trip-events__list`);
for (let i = 0; i < ITEM_COUNT; i++) {
  render(dayListElement, createItemTemplate(), `beforeend`);
}
