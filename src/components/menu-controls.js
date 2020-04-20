import AbstractComponent from "./abstract-component.js";

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

export default class MenuControls extends AbstractComponent {
  constructor(controls) {
    super();
    this._controls = controls;
  }

  getTemplate() {
    return createMenuControlsTemplate(this._controls);
  }
}
