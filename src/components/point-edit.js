import AbstractSmartComponent from './abstract-smart-component.js';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import 'flatpickr/dist/themes/light.css';
import {ActivityTypes, DefaultType, HIDDEN_CLASS, TransportTypes} from "../const";

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
  cancelButtonText: `Cancel`,
};

const createEventTypesMarkup = (types, currentType = DefaultType) => {
  return types
    .map((type) => {
      return (
        `<div class="event__type-item">
            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? `checked` : ``}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type.toUpperCase()}</label>
         </div>`
      );
    })
    .join(`\n`);
};

const createDestinationsListMarkup = (destinations) => {
  return destinations
    .map((destination) => {
      return (
        `<option value="${destination.name}"></option>`
      );
    })
    .join(`\n`);
};

const createOffersMarkup = (offers, allOffers) => {
  return allOffers
    .map((offer, index) => {
      const isChecked = offers.filter((it) => it.title === offer.title).length > 0;
      return (
        `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" 
            id="event-offer-${index}"
            type="checkbox" 
            name="event-offer"
            value="${offer.title}"
            ${isChecked ? `checked` : ``}>
            <label class="event__offer-label" for="event-offer-${index}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`
      );
    })
    .join(`\n`);
};
const createPhotosMarkup = (photos) => {
  return photos.map((photo) => {
    return `<img class="event__photo" src="${photo.src}" alt="Event photo">`;
  }).join(`\n`);
};

const createPointEditTemplate = (point, mode, activeOffers, offers, destinations, externalData) => {
  const {type, destination, start, end, price, description, photos, isFavorite} = point;
  const currency = `&euro;&nbsp;`;
  const typeOffers = (offers.filter((offer) => offer.type === point.type))[0].offers;
  const eventTransferTypesMarkup = createEventTypesMarkup(TransportTypes, type);
  const eventActivityTypesMarkup = createEventTypesMarkup(ActivityTypes, type);
  const destinationsMarkup = createDestinationsListMarkup(destinations);
  const hasOffers = Array.isArray(offers) && offers.length;
  const hasPhotos = Array.isArray(photos) && photos.length;

  const offersMarkup = hasOffers ? createOffersMarkup(activeOffers, typeOffers) : [];
  const photosMarkup = hasPhotos ? createPhotosMarkup(photos) : [];


  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;
  const cancelButtonText = externalData.cancelButtonText;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
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
                  ${type[0].toUpperCase() + type.slice(1)} ${TransportTypes.includes(type) ? `to` : `at`}
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

              <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
              <button class="event__reset-btn" type="reset"> ${mode === `adding` ? cancelButtonText : deleteButtonText}</button>
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
                <h3 class="event__section-title  event__section-title--offers ${offersMarkup ? `` : HIDDEN_CLASS}">Offers</h3>

                <div class="event__available-offers">
                  ${offersMarkup}
                </div>
              </section>
              <section class="event__section  event__section--destination">
                <h3 class="event__section-title  event__section-title--destination ${description ? `` : HIDDEN_CLASS}">Destination</h3>
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


export default class PointEdit extends AbstractSmartComponent {
  constructor(point, mode, offers, destinations) {
    super();
    this._point = point;
    this._mode = mode;
    this._offers = offers;
    this._destinations = destinations;
    this._activeOffers = Object.assign([], point.offers);
    this._flatpickr = null;
    this._submitHandler = null;
    this._favouriteHandler = null;
    this._deleteButtonClickHandler = null;
    this._externalData = DefaultData;

    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getTemplate() {
    return createPointEditTemplate(this._point, this._mode, this._activeOffers, this._offers, this._destinations, this._externalData);
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
    this.setResetButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    // const point = this._point;
    // this._activeOffers = Object.assign([], point.offers);

    this.rerender();
  }

  disableForm() {
    const form = this.getElement();
    const elements = Array.from(form.elements);
    elements.forEach((elem) => {
      elem.readOnly = true;
    });
  }

  activeForm() {
    const form = this.getElement();
    const elements = Array.from(form.elements);
    elements.forEach((elem) => {
      elem.readOnly = false;
    });
  }

  getData() {
    const form = document.querySelector(`.event--edit`);
    return new FormData(form);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setResetButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setFavouriteHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, handler);
    this._favouriteHandler = handler;

  }

  _destroyFlatpickr(fpickr) {
    if (fpickr) {
      fpickr.destroy();
      fpickr = null;
    }
  }

  _applyFlatpickr() {
    this._destroyFlatpickr(this._startDateFlatpickr);
    const startDateElement = this.getElement().querySelector(`#event-start-time-1`);
    this._startDateFlatpickr = flatpickr(startDateElement, {
      altInput: true,
      altFormat: `d/m/y h:i`,
      allowInput: true,
      enableTime: true,
      defaultDate: this._point.start || `today`,
    });
    this._destroyFlatpickr(this._endDateFlatpickr);
    const endDateElement = this.getElement().querySelector(`#event-end-time-1`);
    this._endDateFlatpickr = flatpickr(endDateElement, {
      altInput: true,
      altFormat: `d/m/y h:i`,
      allowInput: true,
      enableTime: true,
      minDate: this._point.start,
      defaultDate: this._point.end || `today`,
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const types = element.querySelectorAll(`.event__type-input`);
    types.forEach((type) => {
      type.addEventListener(`click`, (evt) => {
        this._point.type = evt.target.value;
        this._activeOffers = [];
        this.rerender();
      });
    });

    const offers = element.querySelector(`.event__available-offers`);
    if (offers) {
      offers.addEventListener(`change`, (evt) => {
        if (evt.target.checked) {
          this._activeOffers.push(this._offers.filter((it) => it.title === evt.target.value)[0]);
          this.rerender();
        } else {
          const unCheckedIndex = this._activeOffers.findIndex((it) => it.title === evt.target.value);
          this._activeOffers.splice(unCheckedIndex, 1);
          this.rerender();
        }
      });
    }

    const destination = element.querySelector(`.event__input--destination`);
    destination.addEventListener(`change`, (evt) => {
      this._point.destination = evt.target.value;
      this._point.description = this._destinations.filter((it) => it.name === evt.target.value)[0].description;
      this.rerender();
    });

    const price = element.querySelector(`.event__input--price`);
    price.addEventListener(`change`, () => {
      this._point.price = price.value;
      this.rerender();
    });
  }
}
