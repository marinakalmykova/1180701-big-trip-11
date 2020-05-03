import AbstractSmartComponent from './abstract-smart-component.js';
import {EVENT_TYPES, DESTINATIONS} from "../mock/trip-event.js";
import {formatDate, formatTime} from "../utils/common.js";
import {generateDescription, generateOffersArray} from '../mock/trip-event.js';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import 'flatpickr/dist/themes/light.css';

const createEventTypesMarkup = (types, currentType = `flight`) => {
  return types
    .map((type) => {
      return (
        `<div class="event__type-item">
            <input id="event-type-${type.name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.name}" ${currentType === type.name ? `checked` : ``}>
            <label class="event__type-label  event__type-label--${type.name}" for="event-type-${type.name}-1">${type.name.toUpperCase()}</label>
         </div>`
      );
    })
    .join(`\n`);
};

const createDestinationsListMarkup = (destinations) => {
  return destinations
    .map((destination) => {
      return (
        `<option value="${destination}"></option>`
      );
    })
    .join(`\n`);
};

const createOfferMarkup = (offer) => {
  return (
    `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-1" type="checkbox" name="event-offer-${offer.type}" ${offer.isChosen ? `checked` : ``}>
                <label class="event__offer-label" for="event-offer-${offer.type}-1">
                 <span class="event__offer-title">${offer.name}</span>
                 &plus;
                 &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                </label>
        </div>`
  );
};

const createPhoto = (photoURL) => {
  return `<img class="event__photo" src="${photoURL}" alt="Event photo">`;
};

const createTripEventEditTemplate = (tripEvent) => {
  const {type, destination, dates, price, offers, description, photos, isFavorite} = tripEvent;
  const start = formatDate(dates[0]) + ` ` + formatTime(dates[0]);
  const end = formatDate(dates[1] + ` ` + formatTime(dates[1]));
  const currency = `&euro;&nbsp;`;

  const eventTransferTypesMarkup = createEventTypesMarkup(EVENT_TYPES.filter((it) => it.type === `transfer`), type);
  const eventActivityTypesMarkup = createEventTypesMarkup(EVENT_TYPES.filter((it) => it.type === `activity`), type);
  const destinationsMarkup = createDestinationsListMarkup(DESTINATIONS);
  const offersMarkup = offers.map((offer) => createOfferMarkup(offer)).join(`\n`);
  const photosMarkup = photos.map((photo) => createPhoto(photo)).join(`\n`);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${type.name}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                <div class="event__type-list">
                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Transfer</legend>
                    ${eventTransferTypesMarkup}    
                  </fieldset>

                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Activity</legend>
                    ${eventActivityTypesMarkup}
                  </fieldset>
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                  ${type.name} ${type.type === `transfer` ? `to` : `at`}
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
                <datalist id="destination-list-1">
                  ${destinationsMarkup}
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">
                  From
                </label>
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${start}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">
                  To
                </label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${end}">
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  ${currency}
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Cancel</button>
              <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
                      <label class="event__favorite-btn" for="event-favorite-1">
                        <span class="visually-hidden">Add to favorite</span>
                        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                        </svg>
                      </label>
            </header>
            <section class="event__details">
              <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                <div class="event__available-offers">
                  ${offersMarkup}
                </div>
              </section>
              <section class="event__section  event__section--destination">
                <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">${description}</p>
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${photosMarkup}
                  </div>
                </div>
              </section>
            </section>
          </form>`
  );
};

export default class TripEventEdit extends AbstractSmartComponent {
  constructor(tripEvent) {
    super();
    this._tripEvent = tripEvent;
    this._flatpickr = null;

    this._submitHandler = null;
    this._favouriteHandler = null;
    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getTemplate() {
    return createTripEventEditTemplate(this._tripEvent);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setFavouriteHandler(this._favouriteHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const tripEvent = this._tripEvent;

    tripEvent.destination = this.getElement().querySelector(`.event__input--destination`).value;
    tripEvent.price = this.getElement().querySelector(`.event__input--price`).value;
    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setFavouriteHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, handler);
    this._favouriteHandler = handler;

  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }
    const startDateElement = this.getElement().querySelector(`#event-start-time-1`);
    this._flatpickr = flatpickr(startDateElement, {
      altInput: true,
      allowInput: true,
      defaultDate: this._tripEvent.dates[0],
    });
    const endDateElement = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpickr = flatpickr(endDateElement, {
      altInput: true,
      allowInput: true,
      defaultDate: this._tripEvent.dates[1],
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const types = element.querySelectorAll(`.event__type-input`);
    types.forEach((type)=> {
      type.addEventListener(`click`, () => {
        this._tripEvent.type = type.value;
        this._tripEvent.icon = `img/icons/${type.value}.png`;
        this._tripEvent.offers = new Set(generateOffersArray());
        this.rerender();
      });
    });

    const city = element.querySelector(`.event__input--destination`);
    city.addEventListener(`change`, () => {
      this._tripEvent.destinationCity = city.value;
      this._tripEvent.description = new Array(generateDescription());
      this.rerender();
    });
  }
}
