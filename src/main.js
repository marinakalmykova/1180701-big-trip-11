import API from "./api.js";
import DestinationsModel from "./models/destinations.js";
import FilterController from "./controllers/filter.js";
import MenuComponent from "./components/menu.js";
import OffersModel from "./models/offers.js";
import PointLoadingComponent from "./components/point-loading.js";
import PointsModel from "./models/points.js";
import StatisticsComponent from "./components/statistics.js";
import TripInfoController from "./controllers/trip-info.js";
import TripController from "./controllers/trip";
import {render, RenderPosition} from "./utils/render.js";
import {Tabs} from "./components/menu";

const AUTHORIZATION = `Basic aaffghfjrtyurtkjksdg`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const api = new API(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();


const siteMainElement = document.querySelector(`.trip-main`);
const tripInfoController = new TripInfoController(siteMainElement, pointsModel);


const tripControlElement = document.querySelector(`.trip-controls`);
const tripMenuElement = tripControlElement.querySelector(`.trip-tabs`);

const tripEventsElement = document.querySelector(`.trip-events`);
const tripFilterElement = tripControlElement.querySelector(`.trip-filters`);
const newEventButton = document.querySelector(`.trip-main__event-add-btn`);

const menuComponent = new MenuComponent();
const filterController = new FilterController(tripFilterElement, pointsModel);
const tripController = new TripController(tripEventsElement, pointsModel, offersModel, destinationsModel, api);
const loadingPointComponent = new PointLoadingComponent();
const statisticsComponent = new StatisticsComponent(pointsModel);

render(tripMenuElement, menuComponent, RenderPosition.AFTEREND);
filterController.render();
render(tripEventsElement, loadingPointComponent, RenderPosition.BEFOREEND);
render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();


newEventButton.addEventListener(`click`, () => {
  tripController.createPoint();
  filterController.render();
  newEventButton.disabled = true;
});

menuComponent.setOnChange((tab) => {
  switch (tab) {
    case Tabs.TABLE:
      statisticsComponent.hide();
      tripController.show();
      break;
    case Tabs.STATS:
      tripController.hide();
      statisticsComponent.show();
      break;
  }
});

api.getDestinations()
  .then((destinations) => {
    destinationsModel.setDestinations(destinations);
  })
  .then(() => api.getOffers())
  .then((offers) => {
    offersModel.setOffers(offers);
  })
  .then(() => api.getPoints())
  .then((points) => {
    pointsModel.setPoints(points);
    loadingPointComponent.hide();
    tripInfoController.render();
    tripController.render();
  });


