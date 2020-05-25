import AbstractComponent from "./abstract-component.js";
import moment from "moment";
import {getSortByDate} from "../utils/sort.js";

const DELIMITER = `&nbsp;&mdash;&nbsp;`;
const DOTS = `&nbsp;...&nbsp;`;
const LIMIT = 3;

const getTripPrice = (points) => {
  let sum = 0;
  points.forEach((point) => {
    point.offers.forEach((offer) => {
      sum += offer.price;
    });
    sum += point.price;
  });
  return sum;
};

const getTitle = (points) => {
  if (points.length > LIMIT) {
    return points[0].destination.concat(DELIMITER, DOTS, DELIMITER, points[points.length - 1].destination);
  }
  const title = points.slice().reduce(function (acc, current) {
    return `${acc} ${current.destination} ${DELIMITER}`;
  }, ``);
  return title.slice(0, title.length - DELIMITER.length);
};

const getDateInterval = (points) => {
  if (points.length === 0) {
    return ``;
  }
  const start = new Date(points[0].start);
  const end = new Date(points[points.length - 1].end);

  const startDate = moment(start).format(`MMM D`);
  const endDate = moment(end).format(`MMM D`);

  return `${startDate} ${DELIMITER} ${endDate}`;
};

const createTripInfoTemplate = (points) => {
  const title = getTitle(points);
  const tripDates = getDateInterval(points);
  const tripPrice = getTripPrice(points);
  return (
    `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${title}</h1>

              <p class="trip-info__dates">${tripDates}</p>
            </div>
            
            <p class="trip-info__cost">
                Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripPrice}</span>
            </p>

          </section>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(pointsModel) {
    super();

    this._pointsModel = pointsModel;
  }

  getTemplate() {
    const sortedPoints = getSortByDate(this._pointsModel.getPoints());
    return createTripInfoTemplate(sortedPoints);
  }
}
