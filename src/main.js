import {createTripInfoTemplate} from "./components/trip-info.js";
import {createMenuControlsTemplate} from "./components/menu-controls.js";
import {createMenuFiltersTemplate} from "./components/menu-filters.js";
import {createTripSortingTemplate} from "./components/sorting.js";
import {createTripEventEditTemplate} from "./components/trip-event-edit.js";
import {createTripListTemplate} from "./components/trip-list.js";
import {createDayListTemplate} from './components/day-list.js';
import {createDayTemplate, createTripDates} from "./components/day.js";
import {createTripEventTemplate} from "./components/trip-event.js";
import {generateMenuFilters, generateMenuControls} from "./mock/menu.js";
import {generateEvents} from "./mock/trip-event.js";
import {formatDateWithoutTime} from "./utils";

const EVENTS_COUNT = 15;
const tripEvents = generateEvents(EVENTS_COUNT).sort((a, b) => a.dates[0] - b.dates[0]);
const tripDates = Array.from(createTripDates(tripEvents.slice(1)));

const render = (container, template, place = `afterbegin`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.trip-main`);
const tripControlElement = document.querySelector(`.trip-controls`);
const tripMenuElement = tripControlElement.querySelector(`.trip-tabs`);
const tripFilterElement = tripControlElement.querySelector(`.trip-filters`);
const tripEventsElement = document.querySelector(`.trip-events`);

const menuControls = generateMenuControls();
const menuFilters = generateMenuFilters();

render(siteMainElement, createTripInfoTemplate());
render(tripMenuElement, createMenuControlsTemplate(menuControls), `afterend`);
render(tripFilterElement, createMenuFiltersTemplate(menuFilters), `afterend`);
render(tripEventsElement, createTripSortingTemplate());
render(tripEventsElement, createTripEventEditTemplate(tripEvents[0]), `beforeend`);
render(tripEventsElement, createTripListTemplate(), `beforeend`);
const tripListElement = tripEventsElement.querySelector(`.trip-days`);
tripDates.forEach((date, index) => {
  render(tripListElement, createDayTemplate(date, index), `beforeend`);
  const dayElement = document.getElementById(`${index}`);
  render(dayElement, createDayListTemplate(), `beforeend`);
  const dayListElement = dayElement.querySelector(`.trip-events__list`);
  const dayEvents = tripEvents.slice(1).filter((it) => date === formatDateWithoutTime(it.dates[0]));
  dayEvents.forEach((it) => render(dayListElement, createTripEventTemplate(it), `beforeend`));
});

