export default class Offer {
  constructor(data) {
    this.type = data[`type`];
    this.offers = data[`offers`];
  }

  toRAW() {
    const activeOffers = this.offers.map((offer) => ({
      title: offer.name,
      price: offer.price,
    }));

    return {
      type: this.type,
      offers: activeOffers,
    };
  }

  static parseOffer(data) {
    return new Offer(data);
  }

  static parseOffers(data) {
    return data.map(Offer.parseOffer);
  }
}
