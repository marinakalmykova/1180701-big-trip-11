import AbstractComponent from "./abstract-component";

const createPointLoadingTemplate = () => {
  return (
    `<p class="trip-events__msg">Loading...</p>`
  );
};

export default class PointLoading extends AbstractComponent {
  getTemplate() {
    return createPointLoadingTemplate();
  }
}
