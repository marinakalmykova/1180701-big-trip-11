import moment from 'moment';

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

export const getTime = (date) => {
  return moment(date).format(`HH:MM`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD/MM/YY`);
};

export const formatDateWithoutTime = (date) => {
  return moment(date).format(`MMM Do`);
};

export const formatDuration = (duration) => {
  const seconds = Math.round(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return `${days !== 0 ? days + `D` : ``} ${hours !== 0 ? (hours - days * 24) + `H` : ``} ${minutes - hours * 60 + `M`}`;
};

export const isPastDate = (eventDate, date) => {
  return eventDate < date;
};

export const isFutureDate = (eventDate, date) => {
  return eventDate >= date;
};
