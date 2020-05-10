import TripEventComponent from "../components/point.js";
import TripEventEditComponent from "../components/point-edit.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {getRandomArrayItem} from "../utils/common";
import {DESTINATIONS, EVENT_TYPES, generateDescription, generateOffersArray, generatePhotosArray} from "../mock/point";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyPoint = {
  id: String(new Date() + Math.random()),
  type: getRandomArrayItem(EVENT_TYPES),
  destination: ``,
  destinations: DESTINATIONS,
  start: new Date(),
  end: new Date(),
  price: ``,
  offers: generateOffersArray(),
  description: generateDescription(),
  photos: generatePhotosArray(),
  isFavorite: false,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }
  render(point, mode) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;
    this._mode = mode;

    this._pointComponent = new TripEventComponent(point);
    this._pointEditComponent = new TripEventEditComponent(point);

    this._pointComponent.setOpenButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._pointEditComponent.getData();
      this._onDataChange(this, point, data);
    });

    this._pointEditComponent.setFavouriteHandler(() => {
      this._onDataChange(this, point, Object.assign({}, point, {isFavorite: !point.isFavorite
      }));
    });

    this._pointEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, point, null));

    switch (mode) {
      case Mode.DEFAULT:
        if (oldPointEditComponent && oldPointComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._pointEditComponent, oldPointEditComponent);
        } else {
          render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldPointEditComponent && oldPointComponent) {
          remove(oldPointComponent);
          remove(oldPointEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        const container = document.querySelector(`.trip-events__trip-sort`);
        render(container, this._pointEditComponent, RenderPosition.AFTEREND);
        // document.querySelector(`.event--edit`).classList.add(`trip-events__item`);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  destroy() {
    remove(this._pointEditComponent);
    remove(this._pointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._pointEditComponent.reset();
    if (document.contains(this._pointEditComponent.getElement())) {
      replace(this._pointComponent, this._pointEditComponent);
    }
    this._mode = Mode.DEFAULT;
  }

  _replacePointToEdit() {
    replace(this._pointEditComponent, this._pointComponent);
    this._onViewChange();
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
      }
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
