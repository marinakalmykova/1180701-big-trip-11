import {formatDate, formatDuration} from "../utils";

const createOfferMarkup = (offer) => {
  return (
    `<li class="event__offer">
            <span class="event__offer-title">${offer.name}</span>
            &plus;&nbsp;&euro;
            <span class="event__offer-price">${offer.price}</span>
          </li>`
  );
};

export const createTripEventTemplate = (tripEvent) => {
  const {type, destination, dates, price, offers} = tripEvent;
  const start = formatDate(dates[0]);
  const end = formatDate(dates[1]);
  const duration = formatDuration(dates[1] - dates[0]);
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
                        <time class="event__start-time" datetime="${start}">${start}</time>
                        &mdash;
                        <time class="event__end-time" datetime="${end}">${end}</time>
                      </p>
                      <p class="event__duration">${duration}</p>
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
