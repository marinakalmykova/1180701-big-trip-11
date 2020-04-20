import AbstractComponent from "./abstract-component.js";
import {EVENT_TYPES, DESTINATIONS} from "../mock/trip-event.js";
import {formatDate} from "../utils/common.js";

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
  const {type, destination, dates, price, offers, description, photos} = tripEvent;
  const start = formatDate(dates[0]);
  const end = formatDate(dates[1]);
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

export default class TripEventEdit extends AbstractComponent {
  constructor(tripEvent) {
    super();
    this._tripEvent = tripEvent;
  }

  getTemplate() {
    return createTripEventEditTemplate(this._tripEvent);
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`.event__save-btn`)
      .addEventListener(`submit`, handler);
  }
}
