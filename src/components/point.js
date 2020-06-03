import AbstractComponent from "./abstract-component.js";
import {getTime, formatDuration} from "../utils/common";
import {TransportTypes, OFFERS_LIMIT} from "../const";


const createOffersMarkup = (offers) => {
  if (offers.length > OFFERS_LIMIT) {
    offers = offers.slice(0, OFFERS_LIMIT);
  }
  return offers
    .map((offer) => {
      return (
        `<li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&nbsp;&euro;
            <span class="event__offer-price">${offer.price}</span>
          </li>`
      );
    })
    .join(`\n`);
};

const createPointTemplate = (point) => {
  const {type, destination, start, end, price, offers} = point;
  const startTime = getTime(start);
  const endTime = getTime(end);
  const tripDuration = formatDuration(point);
  const currency = `&euro;&nbsp;`;
  const hasOffers = Array.isArray(offers) && offers.length;

  const offersMarkup = hasOffers ? createOffersMarkup(offers) : [];

  return `<li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">${type[0].toUpperCase() + type.slice(1)} ${TransportTypes.includes(type) ? `to` : `at`} ${destination}</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="${startTime}">${startTime}</time>
                        &mdash;
                        <time class="event__end-time" datetime="${endTime}">${endTime}</time>
                      </p>
                      <p class="event__duration">${tripDuration}</p>
                    </div>

                    <p class="event__price">
                      ${currency}<span class="event__price-value">${price}</span>
                    </p>

                    <h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
                      ${offersMarkup}
                    </ul>

                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>`;
};

export default class Point extends AbstractComponent {
  constructor(point) {
    super();
    this._point = point;
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  setOpenButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
