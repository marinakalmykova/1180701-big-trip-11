import {render, RenderPosition, replace} from "../utils/render";
import TripInfoComponent from "../components/trip-info.js";

export default class InfoController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._tripInfoComponent = null;

    this._onDataChange = this._onDataChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;

    const oldComponent = this._tripInfoComponent;

    this._tripInfoComponent = new TripInfoComponent(this._pointsModel);

    if (oldComponent) {
      replace(this._tripInfoComponent, oldComponent);
    } else {
      render(container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onDataChange() {
    this.render();
  }
}
