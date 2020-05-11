import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import moment from 'moment';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {EVENT_TYPES} from "../mock/point";

const LegendName = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME-SPENT`
};

const LabelName = {
  EURO: `€`,
  PIECES: `x`,
  HOURS: `H`
};

const transportTypes = EVENT_TYPES.filter((it) => it.type === `transfer`);

const generateChartData = (legendName, points) => {
  const labels = [
    ...new Set(points.map((point) => point.type))
  ];

  switch (legendName) {
    case LegendName.MONEY:
      return labels.map((label) => ({
        label, value: points
          .filter((point) => point.type === label)
          .reduce((acc, curr) => acc + Number(curr.price), 0)
      }))
        .filter((point) => point.value !== 0)
        .sort((a, b) => b.value - a.value);
    case LegendName.TRANSPORT:
      return transportTypes.map((label) => ({
        label, value: points.filter((point) => point.type === label).length
      }))
        .filter((point) => point.value !== 0)
        .sort((a, b) => b.value - a.value);

    case LegendName.TIME:
      return labels.map((label) => ({
        label, value: points.filter((point) => point.type === label)
          .reduce((acc, curr) => acc + Math.round(moment.duration(curr.end - curr.start, `milliseconds`) / (60 * 60 * 1000)), 0)
      }))
        .filter((point) => point.value !== 0)
        .sort((a, b) => b.value - a.value);
    default:
      return [];
  }
};

const renderChart = (ctx, data, label, legend) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: data.map((item) => item.label.name.toUpperCase()),
      datasets: [{
        data: data.map((item) => item.value),
        backgroundColor: `#FFFFFF`,
        hoverBackgroundColor: `#FFFFFF`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000080`,
          anchor: `end`,
          align: `start`,
          formatter(value) {
            return `${value}${label}`;
          }
        }
      },
      title: {
        display: true,
        text: legend,
        fontColor: `#000080`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000080`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      },
      layout: {
        padding: {
          left: 50,
          right: 0,
          top: 0,
          bottom: 0
        }
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (`<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>
          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>
          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>
          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`);
};

export default class Statistics extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  hide() {
    super.hide();
  }

  show() {
    super.show();

    this.rerender(this._pointsModel);
  }

  rerender(pointsModel) {
    this._pointsModel = pointsModel;

    super.rerender();

    this._renderCharts();
  }

  recoveryListeners() {}

  _renderCharts() {
    const element = this.getElement();
    const points = this._pointsModel.getPoints();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderChart(moneyCtx, generateChartData(`MONEY`, points), LabelName.EURO, LegendName.MONEY);

    this._transportChart = renderChart(transportCtx, generateChartData(`TRANSPORT`, points), LabelName.PIECES, LegendName.TRANSPORT);

    this._timeSpendChart = renderChart(timeSpendCtx, generateChartData(`TIME-SPENT`, points), LabelName.HOURS, LegendName.TIME);

  }

  _resetCharts() {
    this._resetChart(this._moneyChart);
    this._resetChart(this._transportChart);
    this._resetChart(this._timeSpendChart);
  }

  _resetChart(chart) {
    if (chart) {
      chart.destroy();
      chart = null;
    }
  }
}
