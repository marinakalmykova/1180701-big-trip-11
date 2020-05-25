import AbstractComponent from "./abstract-component.js";

export const Tabs = {
  TABLE: `Table`,
  STATS: `Stats`,
};

const TAB = `trip-tabs__btn`;
const TAB_ACTIVE = `trip-tabs__btn--active`;

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
       <a class="trip-tabs__btn trip-tabs__btn--active"href="#">Table</a>
       <a class="trip-tabs__btn"href="#">Stats</a>
     </nav>`
  );
};

export default class Menu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  _setTabActive(tabActive) {
    const tabElements = this.getElement().querySelectorAll(`.${TAB}`);

    for (const tabElement of tabElements) {
      tabElement.classList.remove(TAB_ACTIVE);
      if (tabElement.textContent === tabActive) {
        tabElement.classList.add(TAB_ACTIVE);
      }
    }
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const tab = evt.target.textContent;
      this._setTabActive(tab);
      handler(tab);
    });
  }

  setDefault() {
    this._setTabActive(Tabs.TABLE);
  }
}
