import {MONTH_SHORT_NAMES} from "../const";



const castDateFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatDate = (date) => {
  const dd = castDateFormat(date.getDate());
  const mm = castDateFormat(date.getMonth() + 1);
  const yy = castDateFormat(date.getFullYear() % 100);
  const hours = castDateFormat(date.getUTCHours());
  const minutes = castDateFormat(date.getUTCMinutes());

  return dd + `/` + mm + `/` + yy + ` ` + hours + `:` + minutes;
};

export const formatDateWithoutTime = (date) => {
  const dd = castDateFormat(date.getDate());
  const mm = MONTH_SHORT_NAMES[date.getMonth()];

  return mm + ` ` + dd;
};

export const formatDuration = (duration) => {
  const seconds = Math.round(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return `${days !== 0 ? days + `D` : ``} ${hours !== 0 ? (hours - days * 24) + `H` : ``} ${minutes - hours * 60 + `M`}`;
};
