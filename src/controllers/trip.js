import NoTripEventsComponent from "../components/no-trip-events.js";
import SortComponent from "../components/sort.js";
import TripEventEditComponent from "../components/trip-event-edit.js";
import DayListComponent from '../components/day-list.js';
import TripEventComponent from "../components/trip-event.js";
import DayComponent from "../components/day.js";
import {createTripDates} from "../components/day.js";
import {formatDateWithoutTime} from "../utils/common.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {EVENTS_COUNT} from "../const.js";


const renderTripEvent = (tripEvent, dayListElement) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      replaceEditToTripEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const tripEventComponent = new TripEventComponent(tripEvent);
  const tripEventEditComponent = new TripEventEditComponent(tripEvent);

  const replaceEditToTripEvent = () => {
    replace(tripEventComponent, tripEventEditComponent);
  };

  const replaceTripEventToEdit = () => {
    replace(tripEventEditComponent, tripEventComponent);
  };

  tripEventComponent.setOpenButtonClickHandler(() => {
    replaceTripEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  tripEventEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTripEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(dayListElement, tripEventComponent, RenderPosition.BEFOREEND);
};

export default class TripController {
  constructor(container) {
    this._container = container.getElement();
    this._noTripEventsComponent = new NoTripEventsComponent();
    this._sortComponent = new SortComponent();
    this._dayListComponent = new DayListComponent();
  }

  render(tripEvents) {
    const tripDates = Array.from(createTripDates(tripEvents));

    if (EVENTS_COUNT === 0) {
      render(this._container, this._noTripEventsComponent, RenderPosition.BEFOREEND);
    } else {
      render(this._container, this._sortComponent, RenderPosition.BEFOREBEGIN);
      render(this._container, this._dayListComponent, RenderPosition.BEFOREEND);

      const tripListElement = document.querySelector(`.trip-days`);
      tripDates.forEach((day, index) => {
        render(tripListElement, new DayComponent(day, index), RenderPosition.BEFOREEND);
        const dayElement = document.getElementById(`${index}`);
        render(dayElement, new DayListComponent(), RenderPosition.BEFOREEND);
        const dayListElement = dayElement.querySelector(`.trip-events__list`);
        const dayEvents = tripEvents.filter((it) => day === formatDateWithoutTime(it.dates[0]));
        dayEvents.forEach((it) => renderTripEvent(it, dayListElement));
      });
    }
  }
}
