import {createElement} from "../utils.js";

const createMenuControlMarkup = (control, isActive) => {
  return (
    `<a class="trip-tabs__btn ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${control}</a>`
  );
};

const createMenuControlsTemplate = (controls) => {
  const menuControlsMarkup = controls.map((it, i) => createMenuControlMarkup(it, i === 0)).join(`\n`);
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
              ${menuControlsMarkup}
            </nav>`
  );
};

export default class MenuControls {
  constructor(controls) {
    this._controls = controls;
    this._element = null;
  }

  getTemplate() {
    return createMenuControlsTemplate(this._controls);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
