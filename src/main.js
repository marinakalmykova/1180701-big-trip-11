import TripInfoComponent from "./components/trip-info.js";
import MenuControlsComponent from "./components/menu-controls.js";
import MenuFiltersComponent from "./components/menu-filters.js";
import TripListComponent from "./components/trip-list.js";
import TripController from "./controllers/trip";
import {generateMenuFilters, generateMenuControls} from "./mock/menu.js";
import {generateEvents} from "./mock/trip-event.js";
import {render, RenderPosition} from "./utils/render.js";
import {EVENTS_COUNT} from "./const.js";

const tripEvents = generateEvents(EVENTS_COUNT).sort((a, b) => a.dates[0] - b.dates[0]);
const menuControls = generateMenuControls();
const menuFilters = generateMenuFilters();

const siteMainElement = document.querySelector(`.trip-main`);
render(siteMainElement, new TripInfoComponent(), RenderPosition.AFTERBEGIN);

const tripControlElement = document.querySelector(`.trip-controls`);
const tripMenuElement = tripControlElement.querySelector(`.trip-tabs`);
render(tripMenuElement, new MenuControlsComponent(menuControls), RenderPosition.BEFOREEND);

const tripFilterElement = tripControlElement.querySelector(`.trip-filters`);
render(tripFilterElement, new MenuFiltersComponent(menuFilters), RenderPosition.BEFOREEND);

const tripListComponent = new TripListComponent();
const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, tripListComponent, RenderPosition.BEFOREEND);

const tripController = new TripController(tripListComponent);
tripController.render(tripEvents);

