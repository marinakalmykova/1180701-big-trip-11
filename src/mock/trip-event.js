const EVENT_TYPES = [
  {
    type: `transfer`,
    name: `Bus`,
  },
  {
    type: `transfer`,
    name: `Drive`,
  },
  {
    type: `transfer`,
    name: `Flight`,
  },
  {
    type: `transfer`,
    name: `Ship`,
  },
  {
    type: `transfer`,
    name: `Taxi`,
  },
  {
    type: `transfer`,
    name: `Train`,
  },
  {
    type: `activity`,
    name: `Check-in`,
  },
  {
    type: `activity`,
    name: `Restaurant`,
  },
  {
    type: `activity`,
    name: `Sightseeing`,
  },
];

const DESTINATIONS = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`];

const OFFERS = [
  {
    type: `luggage`,
    name: `Add luggage`,
    price: 20,
  },
  {
    type: `comfort`,
    name: `Switch to comfort class`,
    price: 100,
  },
  {
    type: `meal`,
    name: `Add meal`,
    price: 15,
  },
  {
    type: `seats`,
    name: `Choose seats`,
    price: 5,
  },
  {
    type: `train`,
    name: `Travel by train`,
    price: 40,
  }
];

const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomTripDates = () => {
  let startDate = new Date();
  startDate.setDate(startDate.getDate() + getRandomIntegerNumber(0, 7));

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + getRandomIntegerNumber(0, 3));
  endDate.setHours(endDate.getHours() + getRandomIntegerNumber(0, 24));
  endDate.setMinutes(endDate.getMinutes() + getRandomIntegerNumber(0, 60));
  return [startDate, endDate];
};

const getRandomPrice = () => {
  return getRandomIntegerNumber(1, 1000);
};

export const generateOffersArray = () => {
  return OFFERS
    .filter(() => Math.random() > 0.5)
    .slice(0, 2);
};

export const generatePhotosArray = () => {
  const amount = getRandomIntegerNumber(1, 5);
  return new Array(amount).fill(``).map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
};

export const generateDescription = () => {
  return DESCRIPTIONS
    .filter(() => Math.random() > 0.5)
    .slice(0, 3)
    .join(` `);
};

const getDuration = (dates) => {
  return dates[1] - dates[0];
};

const generateEvent = () => {
  const dates = getRandomTripDates();
  return {
    type: getRandomArrayItem(EVENT_TYPES),
    destination: getRandomArrayItem(DESTINATIONS),
    dates,
    duration: getDuration(dates),
    price: getRandomPrice(),
    offers: generateOffersArray(),
    description: generateDescription(),
    photos: generatePhotosArray(),
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {generateEvent, generateEvents, EVENT_TYPES, DESTINATIONS};
