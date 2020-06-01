import Point from "../models/point.js";
import {nanoid} from "nanoid";
import Destination from "../models/destination";
import Offer from "../models/offer";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store, offersStore, destinationStore) {
    this._api = api;
    this._store = store;
    this._offersStore = offersStore;
    this._destinationStore = destinationStore;
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map((point) => point.toRAW()));

          this._store.setItems(items);

          return points;
        });
    }

    const storePoints = Object.values(this._store.getItems());

    return Promise.resolve(Point.parsePoints(storePoints));
  }

  createPoint(point) {
    if (isOnline()) {
      return this._api.createPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint.toRAW());

          return newPoint;
        });
    }

    const localNewPointId = nanoid();
    const localNewPoint = Point.clone(Object.assign(point, {id: localNewPointId}));

    this._store.setItem(localNewPoint.id, localNewPoint.toRAW());

    return Promise.resolve(localNewPoint);
  }

  updatePoint(id, point) {
    if (isOnline()) {
      return this._api.updatePoint(id, point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint.toRAW());

          return newPoint;
        });
    }

    const localPoint = Point.clone(Object.assign(point, {id}));

    this._store.setItem(id, localPoint.toRAW());

    return Promise.resolve(localPoint);
  }

  deletePoint(id) {
    if (isOnline()) {
      return this._api.deletePoint(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);

    return Promise.resolve();
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          destinations.forEach((destination, index) => this._destinationStore.setItem(index, destination.toRAW()));

          return destinations;
        });
    }

    const storeDestinations = Object.values(this._destinationStore.getItems());

    return Promise.resolve(Destination.parseDestinations(storeDestinations));
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          offers.forEach((offer, index) => this._offersStore.setItem(index, offer.toRAW()));

          return offers;
        });
    }

    const storeOffers = Object.values(this._offersStore.getItems());

    return Promise.resolve(Offer.parseOffers(storeOffers));
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
