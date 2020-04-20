import AbstractComponent from "./abstract-component.js";

const createNoTripEventsTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class NoTripEvents extends AbstractComponent {
  getTemplate() {
    return createNoTripEventsTemplate();
  }
}
