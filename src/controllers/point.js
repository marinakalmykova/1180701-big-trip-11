import TripEventComponent from "../components/trip-event";
import TripEventEditComponent from "../components/trip-event-edit";
import {render, RenderPosition, replace} from "../utils/render";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._tripEventComponent = null;
    this._tripEventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }
  render(tripEvent) {
    const oldTripEventComponent = this._tripEventComponent;
    const oldTripEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventComponent(tripEvent);
    this._tripEventEditComponent = new TripEventEditComponent(tripEvent);

    this._tripEventComponent.setOpenButtonClickHandler(() => {
      this._replaceTripEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._tripEventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTripEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._tripEventEditComponent.setFavouriteHandler(() => {
      this._onDataChange(this, tripEvent, Object.assign({}, tripEvent, {isFavorite: !tripEvent.isFavorite
      }));
    });

    if (oldTripEventEditComponent && oldTripEventComponent) {
      replace(this._tripEventComponent, oldTripEventComponent);
      replace(this._tripEventEditComponent, oldTripEventEditComponent);
    } else {
      render(this._container, this._tripEventComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTripEvent();
    }
  }

  _replaceEditToTripEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._tripEventEditComponent.reset();
    replace(this._tripEventComponent, this._tripEventEditComponent);
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceTripEventToEdit() {
    replace(this._tripEventEditComponent, this._tripEventComponent);
    this._onViewChange();
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._replaceEditToTripEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
