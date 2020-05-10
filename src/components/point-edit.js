import AbstractSmartComponent from './abstract-smart-component.js';
import {EVENT_TYPES, DESTINATIONS} from "../mock/point.js";
import {getTime, formatDate, getDate} from "../utils/common.js";
import {generateDescription, generateOffersArray, generatePhotosArray} from '../mock/point.js';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import 'flatpickr/dist/themes/light.css';
import moment from "moment";

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

const createPointEditTemplate = (point) => {
  const {type, destination, start, end, startTime, endTime, price, offers, description, photos, isFavorite} = point;
  const pointStartTime = formatDate(start) + ` ` + startTime;
  const pointEndTime = formatDate(end) + ` ` + endTime;
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
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${pointStartTime}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">
                  To
                </label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${pointEndTime}">
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

const parseFormData = (formData) => {
  const start = formData.get(`event-start-time`);
  const end = formData.get(`event-end-time`);
  const startDate = getDate(start);
  const endDate = getDate(end);
  const startTime = getTime(startDate);
  const endTime = getTime(endDate);
  const currentType = formData.get(`event-type`);
  const duration = moment(`${end}`, `DD/MM/YY HH:MM`).toDate() - moment(`${start}`, `DD/MM/YY HH:MM`).toDate();

  return {
    id: String(new Date() + Math.random()),
    type: currentType,
    icon: `img/icons/${currentType}.png`,
    destination: formData.get(`event-destination`),
    start,
    end,
    startTime,
    endTime,
    duration,
    price: formData.get(`event-price`),
    offers: generateOffersArray(),
    description: generateDescription(),
    photos: generatePhotosArray(),
    isFavorite: false,
  };
};

export default class PointEdit extends AbstractSmartComponent {
  constructor(point) {
    super();
    this._point = point;
    this._flatpickr = null;

    this._submitHandler = null;
    this._favouriteHandler = null;
    this._deleteButtonClickHandler = null;

    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getTemplate() {
    return createPointEditTemplate(this._point);
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setFavouriteHandler(this._favouriteHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const point = this._point;

    point.destination = this.getElement().querySelector(`.event__input--destination`).value;
    point.price = this.getElement().querySelector(`.event__input--price`).value;
    this.rerender();
  }

  setFavouriteHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, handler);
    this._favouriteHandler = handler;

  }

  getData() {
    const form = this.getElement().querySelector(`.event--edit`);
    const formData = new FormData(form);

    return parseFormData(formData);
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
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
      defaultDate: this._point.start,
    });
    const endDateElement = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpickr = flatpickr(endDateElement, {
      altInput: true,
      allowInput: true,
      defaultDate: this._point.end,
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const types = element.querySelectorAll(`.event__type-input`);
    types.forEach((type)=> {
      type.addEventListener(`click`, () => {
        this._point.type = type.value;
        this._point.icon = `img/icons/${type.value}.png`;
        this._point.offers = new Set(generateOffersArray());
        this.rerender();
      });
    });

    const city = element.querySelector(`.event__input--destination`);
    city.addEventListener(`change`, () => {
      this._point.destinationCity = city.value;
      this._point.description = new Array(generateDescription());
      this.rerender();
    });

    const price = element.querySelector(`.event__input--price`);
    price.addEventListener(`change`, () => {
      this._point.price = price.value;
      this.rerender();
    });
  }
}
