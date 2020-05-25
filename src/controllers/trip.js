import NoPointsComponent from "../components/no-points.js";
import SortComponent, {SortType} from "../components/sort.js";
import DayInfoComponent from "../components/day-info.js";
import TripComponent from "../components/trip.js";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point.js";
import {FilterType} from "../const.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {getSortedPoints} from "../utils/sort.js";

const newEventButton = document.querySelector(`.trip-main__event-add-btn`);

const generateDays = (points) => {
  return [...new Set(points.map((item) => new Date(item.start).toDateString()))].sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });
};

const renderPoints = (container, points, onDataChange, onViewChange, offers, destinations) => {
  return points.map((point) => {
    const pointController = new PointController(container, onDataChange, onViewChange, offers, destinations);
    pointController.render(point, PointControllerMode.DEFAULT);
    return pointController;
  });
};

const renderTripDay = (container, points, onDataChange, onViewChange, offers, destinations, date, index) => {
  const tripDay = date ? new DayInfoComponent(date, index + 1) : new DayInfoComponent();
  const tripDayElement = tripDay.getElement();
  const eventListElement = tripDayElement.querySelector(`.trip-events__list`);
  const pointController = renderPoints(eventListElement, points, onDataChange, onViewChange, offers, destinations);

  render(container, tripDay, RenderPosition.BEFOREEND);

  return pointController;
};

const renderEventsList = (container, points, onDataChange, onViewChange, offers, destinations) => {
  let events = [];
  const dates = generateDays(points);

  dates.forEach((date, index) => {
    const days = points.filter((point) => {
      return date === new Date(point.start).toDateString();
    });
    events = events.concat(renderTripDay(container, days, onDataChange, onViewChange, offers, destinations, date, index));
  });

  return events;
};

export default class TripController {
  constructor(container, pointsModel, offersModel, destinationsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._newEventButton = newEventButton;
    this._api = api;

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

  hide() {
    if (this._creatingPoint) {
      this._creatingPoint.destroy();
      this._creatingPoint = null;
    }
    this._onViewChange();
    this._sortComponent.hide();
    this._tripComponent.hide();
  }

  show() {
    this._setSortStateDefault();
    this._sortComponent.show();
    this._tripComponent.show();
  }

  render() {
    const container = this._container;
    const points = this._pointsModel.getPoints();
    const offers = this._offersModel.getOffers();
    const destinations = this._destinationsModel.getDestinations();

    if (points.length === 0) {
      render(container, this._noPointsComponent, RenderPosition.BEFOREEND);
    }
    render(container, this._tripComponent, RenderPosition.BEFOREEND);
    render(container, this._sortComponent, RenderPosition.AFTERBEGIN);

    const dayListElement = this._tripComponent.getElement();
    this._renderPoints(dayListElement, points, offers, destinations);
  }

  createPoint() {
    const offers = this._offersModel.getOffers();
    const destinations = this._destinationsModel.getDestinations();
    if (this._creatingPoint) {
      return;
    }

    const dayListElement = this._tripComponent.getElement();
    this._pointsModel.setFilter(FilterType.EVERYTHING);
    this._onSortTypeChange(SortType.EVENT);
    this._sortComponent.resetSortType();

    this._creatingPoint = new PointController(dayListElement, this._onDataChange, this._onViewChange, offers, destinations);
    this._pointControllers.push(this._creatingPoint);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
  }

  _removePoints() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    const dayListElement = document.querySelector(`.trip-days`);
    dayListElement.innerHTML = ``;
  }

  _renderPoints(container, points, offers, destinations) {
    const newPoints = renderEventsList(container, points, this._onDataChange, this._onViewChange, offers, destinations);
    this._pointControllers = this._pointControllers.concat(newPoints);
  }

  _renderTripDay(container, points, offers, destinations) {
    const newPoints = renderTripDay(container, points, this._onDataChange, this._onViewChange, offers, destinations);
    this._pointControllers = newPoints;
  }

  _setSortStateDefault() {
    this._sortComponent.resetSortType();
    remove(this._sortComponent);
    render(this._container, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyPoint) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
        this._newEventButton.disabled = false;
      } else {
        this._api.createPoint(newData)
          .then((point) => {
            this._pointsModel.addPoint(point);
            this._pointsControllers = [].concat(pointController, this._pointsControllers);
            this._updatePoints();
          })
          .catch(() => {
            pointController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
          this._onSortTypeChange(this._sortComponent.getSortType());
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      this._api.updatePoint(oldData.id, newData)
        .then((point) => {
          const isSuccess = this._pointsModel.updatePoint(oldData.id, point);

          if (isSuccess) {
            this._updatePoints();
            this._onSortTypeChange(this._sortComponent.getSortType());
          }
        })
        .catch(() => {
          pointController.shake();
        });
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _updatePoints() {
    const points = this._pointsModel.getPoints();
    const offers = this._offersModel.getOffers();
    const destinations = this._destinationsModel.getDestinations();
    this._removePoints();
    this._renderPoints(document.querySelector(`.trip-days`), points.slice(), offers, destinations);
  }

  _onSortTypeChange(sortType) {
    this._creatingPoint = null;
    const points = this._pointsModel.getPoints();
    const offers = this._offersModel.getOffers();
    const destinations = this._destinationsModel.getDestinations();
    const sortedEvents = getSortedPoints(points, sortType);

    const dayListElement = this._tripComponent.getElement();
    if (sortType === SortType.EVENT) {
      this._removePoints();
      this._renderPoints(dayListElement, sortedEvents, offers, destinations);
    } else {
      this._removePoints();
      this._renderTripDay(dayListElement, sortedEvents, offers, destinations);
    }
  }

  _onFilterChange() {
    this._updatePoints();
    this._onSortTypeChange(this._sortComponent.getSortType());
  }
}
