import AbstractComponent from "./abstract-component.js";

const createTripTemplate = () => {
  return `<ul class="trip-days">
          </ul>`;
};

export default class Trip extends AbstractComponent {
  getTemplate() {
    return createTripTemplate();
  }
}
