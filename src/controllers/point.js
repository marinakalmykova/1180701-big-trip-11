import PointComponent from "../components/point.js";
import PointEditComponent from "../components/point-edit.js";
import PointModel from "../models/point.js";
import moment from "moment";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyPoint = {
  type: `flight`,
  destination: ` `,
  start: new Date().toISOString(),
  end: new Date().toISOString(),
  price: ` `,
  description: ` `,
  isFavorite: false,
  photos: [],
  offers: [],
};

const newEventButton = document.querySelector(`.trip-main__event-add-btn`);

const getSelectedOffers = (formData, offers) => {
  const selectedOffers = [];
  const selectedValues = formData.getAll(`event-offer`);
  selectedValues.forEach((value) => {
    const offer = offers.filter((it) => it.title === value)[0];
    if (offer) {
      selectedOffers.push(offer);
    }
  });
  return selectedOffers;
};

const parseFormData = (formData, offers, destinations) => {
  const start = moment(formData.get(`event-start-time`)).toISOString();
  const end = moment(formData.get(`event-end-time`)).toISOString();
  const name = formData.get(`event-destination`);
  const type = formData.get(`event-type`);
  const destination = destinations.filter((it) => it.name === name)[0];

  return new PointModel({
    "type": type,
    "is_favorite": !!formData.get(`event-favorite`),
    "base_price": Number.parseInt(formData.get(`event-price`), 10),
    "date_from": start,
    "date_to": end,
    "destination": destination,
    "offers": getSelectedOffers(formData, offers),
  });
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, offers, destinations) {
    this._container = container;
    this._offers = offers;
    this._destinations = destinations;

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
    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point, this._mode, this._offers, this._destinations);

    this._pointComponent.setOpenButtonClickHandler(() => {
      this._onViewChange();
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._pointEditComponent.getData();
      const data = parseFormData(formData, this._offers, this._destinations);
      this._pointEditComponent.disableForm();
      this._pointEditComponent.setData({
        saveButtonText: `Saving...`,
      });
      this._onDataChange(this, point, data);
      this._pointEditComponent.activeForm();
      newEventButton.disabled = false;
    });

    this._pointEditComponent.setResetButtonClickHandler(() => {
      this._pointEditComponent.disableForm();
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
        newEventButton.disabled = false;
        this._pointEditComponent.setData({
          deleteButtonText: `Cancelling...`,
        });
      } else {
        this._pointEditComponent.setData({
          deleteButtonText: `Deleting...`,
        });
        this._onDataChange(this, point, null);
      }
      this._pointEditComponent.activeForm();
    });

    this._pointEditComponent.setFavouriteHandler(() => {
      const newPoint = PointModel.clone(point);
      newPoint.isFavorite = !newPoint.isFavorite;
      this._onDataChange(this, point, newPoint);
    });

    this._pointEditComponent.setResetButtonClickHandler(() => this._onDataChange(this, point, null));

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
    if (this._mode === Mode.ADDING) {
      this._onDataChange(this, EmptyPoint, null);
      newEventButton.disabled = false;
    }
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._pointEditComponent.reset();
    if (document.contains(this._pointEditComponent.getElement())) {
      replace(this._pointComponent, this._pointEditComponent);
    }
    this._mode = Mode.DEFAULT;
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._pointEditComponent, this._pointComponent);
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

  shake() {
    this._pointEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._pointComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._pointEditComponent.getElement().style.animation = ``;
      this._pointComponent.getElement().style.animation = ``;

      this._pointEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
        cancelButtonText: `Cancel`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
