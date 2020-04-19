import TripInfoComponent from "./components/trip-info.js";
import MenuControlsComponent from "./components/menu-controls.js";
import MenuFiltersComponent from "./components/menu-filters.js";
import SortComponent from "./components/sort.js";
import TripEventEditComponent from "./components/trip-event-edit.js";
import TripListComponent from "./components/trip-list.js";
import DayListComponent from './components/day-list.js';
import TripEventComponent from "./components/trip-event.js";
import DayComponent from "./components/day.js";
import {createTripDates} from "./components/day.js";
import {generateMenuFilters, generateMenuControls} from "./mock/menu.js";
import {generateEvents} from "./mock/trip-event.js";
import {formatDateWithoutTime} from "./utils";
import {render, RenderPosition} from "./utils.js";

const EVENTS_COUNT = 15;
const tripEvents = generateEvents(EVENTS_COUNT).sort((a, b) => a.dates[0] - b.dates[0]);
const tripDates = Array.from(createTripDates(tripEvents));

const renderTripEvent = (tripEvent, dayListElement) => {
  const tripEventComponent = new TripEventComponent(tripEvent);
  const tripEventEditComponent = new TripEventEditComponent(tripEvent);

  const openButton = tripEventComponent.getElement().querySelector(`.event__rollup-btn`);
  openButton.addEventListener(`click`, () => {
    dayListElement.replaceChild(tripEventEditComponent.getElement(), tripEventComponent.getElement());
  });

  const saveButton = tripEventEditComponent.getElement().querySelector(`.event__save-btn`);
  saveButton.addEventListener(`click`, () => {
    dayListElement.replaceChild(tripEventComponent.getElement(), tripEventEditComponent.getElement());
  });

  render(dayListElement, tripEventComponent.getElement(), RenderPosition.BEFOREEND);
};

const siteMainElement = document.querySelector(`.trip-main`);
const tripControlElement = document.querySelector(`.trip-controls`);
const tripMenuElement = tripControlElement.querySelector(`.trip-tabs`);
const tripFilterElement = tripControlElement.querySelector(`.trip-filters`);
const tripEventsElement = document.querySelector(`.trip-events`);

const menuControls = generateMenuControls();
const menuFilters = generateMenuFilters();

render(siteMainElement, new TripInfoComponent().getElement(), RenderPosition.AFTERBEGIN);
render(tripMenuElement, new MenuControlsComponent(menuControls).getElement(), RenderPosition.BEFOREEND);
render(tripFilterElement, new MenuFiltersComponent(menuFilters).getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, new TripListComponent().getElement(), RenderPosition.BEFOREEND);

const tripListElement = tripEventsElement.querySelector(`.trip-days`);
tripDates.forEach((date, index) => {
  render(tripListElement, new DayComponent(date, index).getElement(), RenderPosition.BEFOREEND);
  const dayElement = document.getElementById(`${index}`);
  render(dayElement, new DayListComponent().getElement(), RenderPosition.BEFOREEND);
  const dayListElement = dayElement.querySelector(`.trip-events__list`);
  const dayEvents = tripEvents.filter((it) => date === formatDateWithoutTime(it.dates[0]));
  dayEvents.forEach((it) => renderTripEvent(it, dayListElement));
});


