import TripInfoComponent from "./components/trip-info.js";
import MenuComponent from "./components/menu.js";
import FilterController from "./controllers/filter.js";
import TripCostComponent from "./components/trip-cost.js";
import TripController from "./controllers/trip";
import PointsModel from "./models/points.js";
import {generateEvents} from "./mock/point.js";
import {render, RenderPosition} from "./utils/render.js";
import {EVENTS_COUNT} from "./const.js";

const points = generateEvents(EVENTS_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);


const countTripPrice = () => {
  const tripPrices = [];
  const offerPrices = [];

  points.forEach((item) => {
    tripPrices.push(item.price);
  });

  points.forEach((item) => {
    item.offers.forEach((element) => {
      offerPrices.push(+element.price);
    });
  });

  return [...tripPrices, ...offerPrices].reduce((sum, current) => {
    return sum + current;
  }, 0);
};

const siteMainElement = document.querySelector(`.trip-main`);
render(siteMainElement, new TripInfoComponent(), RenderPosition.AFTERBEGIN);

const tripControlElement = document.querySelector(`.trip-controls`);
const tripMenuElement = tripControlElement.querySelector(`.trip-tabs`);
render(tripMenuElement, new MenuComponent(), RenderPosition.AFTEREND);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, new TripCostComponent(countTripPrice()), RenderPosition.BEFOREEND);

const tripFilterElement = tripControlElement.querySelector(`.trip-filters`);
const filterController = new FilterController(tripFilterElement, pointsModel);
filterController.render();

const tripEventsElement = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsElement, pointsModel);
tripController.render();

const newEventButton = document.querySelector(`.trip-main__event-add-btn`);

newEventButton.addEventListener(`click`, () => {
  tripController.createPoint();
  filterController.render();
  newEventButton.disabled = true;
});
