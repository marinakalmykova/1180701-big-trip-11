import API from "./api/index.js";
import DestinationsModel from "./models/destinations.js";
import FilterController from "./controllers/filter.js";
import MenuComponent from "./components/menu.js";
import OffersModel from "./models/offers.js";
import PointLoadingComponent from "./components/point-loading.js";
import PointsModel from "./models/points.js";
import Provider from "./api/provider.js";
import StatisticsComponent from "./components/statistics.js";
import Store from "./api/store.js";
import TripInfoController from "./controllers/trip-info.js";
import TripController from "./controllers/trip";
import {render, RenderPosition} from "./utils/render.js";
import {Tabs} from "./components/menu.js";

const AUTHORIZATION = `Basic aaffghfjrtyurtu45sdg`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER = `v1`;
const STORE_OFFERS = `offers`;
const STORE_DESTINATIONS = `destinations`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const STORE_OFFERS_NAME = `${STORE_OFFERS}-${STORE_NAME}`;
const STORE_DESTINATIONS_NAME = `${STORE_DESTINATIONS}-${STORE_NAME}`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const offersStore = new Store(STORE_OFFERS_NAME, window.localStorage);
const destinationsStore = new Store(STORE_DESTINATIONS_NAME, window.localStorage);

const apiWithProvider = new Provider(api, store, offersStore, destinationsStore);
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
const tripController = new TripController(tripEventsElement, pointsModel, offersModel, destinationsModel, apiWithProvider);
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

apiWithProvider.getDestinations()
  .then((destinations) => {
    destinationsModel.setDestinations(destinations);
  })
  .then(() => apiWithProvider.getOffers())
  .then((offers) => {
    offersModel.setOffers(offers);
  })
  .then(() => apiWithProvider.getPoints())
  .then((points) => {
    pointsModel.setPoints(points);
    loadingPointComponent.hide();
    tripInfoController.render();
    tripController.render();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
    }).catch(() => {
    // Действие, в случае ошибки при регистрации ServiceWorker
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});


