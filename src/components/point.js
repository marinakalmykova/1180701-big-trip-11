import AbstractComponent from "./abstract-component.js";
import {formatDuration} from "../utils/common";

const createOfferMarkup = (offer) => {
  return (
    `<li class="event__offer">
            <span class="event__offer-title">${offer.name}</span>
            &plus;&nbsp;&euro;
            <span class="event__offer-price">${offer.price}</span>
          </li>`
  );
};

const createPointTemplate = (point) => {
  const {type, destination, startTime, endTime, duration, price, offers} = point;
  const tripDuration = formatDuration(duration);
  const currency = `&euro;&nbsp;`;

  const offersMarkup = offers.map((offer) => createOfferMarkup(offer)).join(`\n`);

  return `<li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/${type.name}.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">${type.name} ${type.type === `transfer` ? `to` : `at`} ${destination}</h3>

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
