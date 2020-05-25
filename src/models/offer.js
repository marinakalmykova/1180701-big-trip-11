export default class Offer {
  constructor(data) {
    this.type = data[`type`];
    this.offers = data[`offers`];
  }

  toRAW() {
    return {
      "type": this.type,
      "offers": this.offers,
    };
  }

  static parseOffer(data) {
    return new Offer(data);
  }

  static parseOffers(data) {
    return data.map(Offer.parseOffer);
  }
}
