import NoPointsComponent from "../components/no-points.js";
import SortComponent, {SortType} from "../components/sort.js";
import DayInfoComponent from "../components/day-info.js";
import TripComponent from "../components/trip.js";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point.js";
import {FilterType} from "../const.js";
import {render, RenderPosition} from "../utils/render.js";

const newEventButton = document.querySelector(`.trip-main__event-add-btn`);

const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];

  switch (sortType) {
    case SortType.PRICE:
      sortedPoints = points.slice().sort((a, b) => b.price - a.price);
      break;
    case SortType.TIME:
      sortedPoints = points.slice().sort((a, b) => b.duration - a.duration);
      break;
    case SortType.EVENT:
      sortedPoints = points.slice();
      break;
  }
  return sortedPoints;
};

const generateDays = (points) => {
  return [...new Set(points.map((item) => new Date(item.start).toDateString()))].sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });
};

const renderPoints = (container, points, onDataChange, onViewChange) => {
  return points.map((point) => {
    const pointController = new PointController(container, onDataChange, onViewChange);
    pointController.render(point, PointControllerMode.DEFAULT);
    return pointController;
  });
};

const renderTripDay = (container, points, onDataChange, onViewChange, date, index) => {
  const tripDay = date ? new DayInfoComponent(date, index + 1) : new DayInfoComponent();
  const tripDayElement = tripDay.getElement();
  const eventListElement = tripDayElement.querySelector(`.trip-events__list`);

  const pointController = renderPoints(eventListElement, points, onDataChange, onViewChange);

  render(container, tripDay, RenderPosition.BEFOREEND);

  return pointController;
};

const renderEventsList = (container, points, onDataChange, onViewChange) => {
  let events = [];
  const dates = generateDays(points);

  dates.forEach((date, index) => {
    const days = points.filter((point) => {
      return date === new Date(point.start).toDateString();
    });
    events = events.concat(renderTripDay(container, days, onDataChange, onViewChange, date, index));
  });

  return events;
};

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._newEventButton = newEventButton;

    this._pointControllers = [];
    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._tripComponent = new TripComponent();
    this._creatingPoint = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._removePoints = this._removePoints.bind(this);
    this._updatePoints = this._updatePoints.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    const container = this._container;
    const points = this._pointsModel.getPoints();

    if (points.length === 0) {
      render(container, this._noPointsComponent, RenderPosition.BEFOREEND);
    }
    render(container, this._tripComponent, RenderPosition.BEFOREEND);
    render(container, this._sortComponent, RenderPosition.AFTERBEGIN);

    const dayListElement = container.querySelector(`.trip-days`);
    this._renderPoints(dayListElement, points);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    const dayListElement = this._container.querySelector(`.trip-days`);
    this._pointsModel.setFilter(FilterType.EVERYTHING);
    this._onSortTypeChange(SortType.EVENT);
    this._sortComponent.resetSortType();

    this._creatingPoint = new PointController(dayListElement, this._onDataChange, this._onViewChange);
    this._pointControllers.push(this._creatingPoint);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
  }

  _removePoints() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    const dayListElement = document.querySelector(`.trip-days`);
    dayListElement.innerHTML = ``;
  }

  _renderPoints(container, points) {
    const newPoints = renderEventsList(container, points, this._onDataChange, this._onViewChange);
    this._pointControllers = this._pointControllers.concat(newPoints);
  }

  _renderTripDay(container, points) {
    const newPoints = renderTripDay(container, points, this._onDataChange, this._onViewChange);
    this._pointControllers = newPoints;
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyPoint) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
        this._newEventButton.disabled = false;
        // this._creatingPoint = null;
        // this._pointControllers.pop();
      } else {
        this._pointsModel.addPoint(newData);
        pointController.render(newData, PointControllerMode.DEFAULT);
        // this._updatePoints();
        // this._newEventButton.disabled = false;
        this._pointControllers = [].concat(pointController, this._pointControllers);
        // this._onViewChange();
      }
    } else if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

      if (isSuccess) {
        pointController.render(newData, PointControllerMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(document.querySelector(`.trip-days`), this._pointsModel.getPoints().slice());
  }

  _onSortTypeChange(sortType) {
    const tripEventsElement = document.querySelector(`.trip-events`);
    const dayListElement = tripEventsElement.querySelector(`.trip-days`);
    const sortedEvents = getSortedPoints(this._pointsModel.getPoints(), sortType);

    dayListElement.innerHTML = ``;
    newEventButton.disabled = false;


    if (sortType === SortType.EVENT) {
      this._removePoints();
      this._renderPoints(dayListElement, sortedEvents);
    } else {
      this._removePoints();
      this._renderTripDay(dayListElement, sortedEvents);
    }
  }

  _onFilterChange() {
    this._updatePoints();
  }
}
