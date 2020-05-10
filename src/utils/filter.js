import {isPastDate, isFutureDate} from './common.js';
import {FilterType} from '../const.js';

export const getPastPoints = (points, date) => {
  return points.filter((point) => isPastDate(point.start, date));
};

export const getFuturePoints = (points, date) => {
  return points.filter((point) => isFutureDate(point.start, date));
};

export const getAllPoints = (points) => {
  return points;
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return getAllPoints(points);
    case FilterType.FUTURE:
      return getFuturePoints(points, nowDate);
    case FilterType.PAST:
      return getPastPoints(points, nowDate);
  }

  return points;
};
