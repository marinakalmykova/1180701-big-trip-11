import {SortType} from "../components/sort";
import {getDuration} from "./common";

export const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];

  switch (sortType) {
    case SortType.PRICE:
      sortedPoints = points.slice().sort((a, b) => b.price - a.price);
      break;
    case SortType.TIME:
      sortedPoints = points.slice().sort((a, b) => getDuration(b) - getDuration(a));
      break;
    case SortType.EVENT:
      sortedPoints = points.slice();
      break;
  }
  return sortedPoints;
};

export const getSortByDate = (points) => {
  return points.slice().sort((a, b) => {
    const dateA = new Date(a.start);
    const dateB = new Date(b.start);
    return dateA - dateB;
  });
};
