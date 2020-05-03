import NoTripEventsComponent from "../components/no-trip-events.js";
import SortComponent, {SortType} from "../components/sort.js";
import DayListComponent from '../components/day-list.js';
import DayComponent from "../components/day.js";
import DayInfoComponent from "../components/day-info.js";
import {createTripDates} from "../components/day.js";
import {formatDateWithoutTime} from "../utils/common.js";
import {render, RenderPosition} from "../utils/render.js";
import PointController from "./point";

const renderTripEvents = (tripEvents, tripListElement, onDataChange, onViewChange) => {
  return tripEvents.map((tripEvent) => {
    const pointController = new PointController(tripListElement, onDataChange, onViewChange);
    pointController.render(tripEvent);
    return pointController;
  });
};

const getSortedEvents = (tripEvents, sortType) => {
  let sortedTripEvents = [];

  switch (sortType) {
    case SortType.PRICE:
      sortedTripEvents = tripEvents.slice().sort((a, b) => b.price - a.price);
      break;
    case SortType.TIME:
      sortedTripEvents = tripEvents.slice().sort((a, b) => b.duration - a.duration);
      break;
    case SortType.EVENT:
      sortedTripEvents = tripEvents.slice();
      break;
  }
  return sortedTripEvents;
};

export default class TripController {
  constructor(container) {
    this._container = container.getElement();

    this._tripEvents = [];
    this._pointControllers = [];
    this._noTripEventsComponent = new NoTripEventsComponent();
    this._sortComponent = new SortComponent();
    this._dayListComponent = new DayListComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._renderEventsList = this._renderEventsList.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(tripEvents) {
    this._tripEvents = tripEvents;
    const tripDates = Array.from(createTripDates(tripEvents));

    if (this._tripEvents.length === 0) {
      render(this._container, this._noTripEventsComponent, RenderPosition.BEFOREEND);
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREBEGIN);
    render(this._container, this._dayListComponent, RenderPosition.BEFOREEND);

    tripDates.forEach((day, index) => {
      const dayEvents = this._tripEvents.filter((it) => day === formatDateWithoutTime(it.dates[0]));
      this._renderEventsList(dayEvents, day, index);
      const dayElement = document.getElementById(`${index}`);
      const dayInfoElement = dayElement.querySelector(`.day__info`);
      render(dayInfoElement, new DayInfoComponent(day, index), RenderPosition.BEFOREEND);
    });
  }

  _renderEventsList(events, day = 0, index = 0) {
    const tripListElement = document.querySelector(`.trip-days`);
    render(tripListElement, new DayComponent(day, index), RenderPosition.BEFOREEND);
    const dayElement = document.getElementById(`${index}`);
    render(dayElement, new DayListComponent(), RenderPosition.BEFOREEND);
    const dayListElement = dayElement.querySelector(`.trip-events__list`);
    const newTripEvents = renderTripEvents(events, dayListElement, this._onDataChange, this._onViewChange);
    this._pointControllers = this._pointControllers.concat(newTripEvents);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._tripEvents.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tripEvents = [].concat(this._tripEvents.slice(0, index), newData, this._tripEvents.slice(index + 1));

    pointController.render(this._tripEvents[index]);
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const tripListElement = document.querySelector(`.trip-days`);
    const sortedEvents = getSortedEvents(this._tripEvents, sortType);
    tripListElement.innerHTML = ``;
    this._renderEventsList(sortedEvents);
    document.getElementById(`sort-${sortType}`).checked = true;
  }
}
