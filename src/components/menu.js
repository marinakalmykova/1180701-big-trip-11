import AbstractComponent from "./abstract-component.js";

export const Tabs = [`Table`, `Stats`];

const createMenuMarkup = (control, isActive) => {
  return (
    `<a class="trip-tabs__btn ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${control}</a>`
  );
};

const createMenuTemplate = (controls) => {
  const menuMarkup = controls.map((it) => createMenuMarkup(it, it.checked)).join(`\n`);

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
              ${menuMarkup}
            </nav>`
  );
};

export default class Menu extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createMenuTemplate(Tabs);
  }

  setActiveTab(tabActive, tabInactive) {
    const itemActive = this.getElement().querySelector(`#${tabActive}`);
    const itemInactive = this.getElement().querySelector(`#${tabInactive}`);

    if (itemActive) {
      itemActive.classList.add(`trip-tabs__btn--active`);
      itemInactive.classList.remove(`trip-tabs__btn--active`);
    }
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const tab = evt.target.id;

      handler(tab);
    });
  }
}
