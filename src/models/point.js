export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.destination = data[`destination`].name;
    this.start = data[`date_from`];
    this.end = data[`date_to`];
    this.price = data[`base_price`];
    this.offers = data[`offers`];
    this.description = data[`destination`].description || ``;
    this.photos = data[`destination`].pictures || [];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      "id": this.id,
      "type": this.type,
      "destination": {
        name: this.destination,
        description: this.description,
        pictures: this.photos,
      },
      "date_from": this.start,
      "date_to": this.end,
      "base_price": this.price,
      "offers": this.offers,
      "is_favorite": this.isFavorite,
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
