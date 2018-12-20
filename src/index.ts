import { ClickInteraction } from "./interaction";

export interface Datum {
  x: number;
  y: number;
}

export interface Dataset {
  data: Datum[];
  type: "scatter" | "line";
  style?: string;
}

interface PlotOptions {
  targetElement: HTMLDivElement;
  datasets?: Dataset[];
  onClick?: (d: Datum) => void;
}

/**
 * Plot is the top level class for vermeer
 */
export class Plot {
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  clickInteraction: ClickInteraction;
  datasets?: Dataset[];
  xBounds: [number, number];
  yBounds: [number, number];
  dpi: number;

  constructor(options: PlotOptions) {
    this.canvasElement = document.createElement("canvas");
    options.targetElement.appendChild(this.canvasElement);
    this.ctx = this.canvasElement.getContext("2d");
    this.dpi = window.devicePixelRatio || 1;
    this.ctx.scale(this.dpi, this.dpi);
    this.canvasElement.width = options.targetElement.clientWidth * this.dpi;
    this.canvasElement.style.width = "100%";
    this.canvasElement.height = options.targetElement.clientHeight * this.dpi;
    if (options.datasets) {
      this.setDatasets(options.datasets);
    }

    if (options.onClick) {
      this.clickInteraction = new ClickInteraction({
        plot: this,
        handler: options.onClick
      });
    }
  }

  setDatasets(d: Dataset[]) {
    this.datasets = d;
    this.xBounds = this.bounds("x");
    this.yBounds = this.bounds("y");
  }

  /**
   * bounds returns the [min, max] for the values present in the current datasets
   * @param property is "x" or "y" for the specified axis
   */
  bounds(property: "x" | "y"): [number, number] {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (let dataset of this.datasets) {
      for (let d of dataset.data) {
        if (d[property] > max) {
          max = d[property];
        }

        if (d[property] < min) {
          min = d[property];
        }
      }
    }

    return [min, max];
  }

  /**
   * scale returns the pixel location for a datum given the bounds and canvasElement dimmensions.
   * @param d Datum to scale
   */
  scale(d: Datum): [number, number] {
    const xPixels =
      ((d.x - this.xBounds[0]) / (this.xBounds[1] - this.xBounds[0])) *
      this.canvasElement.width;

    const yPixels =
      ((d.y - this.yBounds[0]) / (this.yBounds[1] - this.yBounds[0])) *
      this.canvasElement.height;

    return [
      Math.round(xPixels),
      Math.round(this.canvasElement.height - yPixels)
    ];
  }

  /**
   * reverseScale returns the translated datum for a given pixel coordinate.
   * @param d Datum to scale
   */
  reverseScale(d: [number, number]): Datum {
    d = [d[0] * this.dpi, d[1] * this.dpi];

    const x =
      (d[0] / this.canvasElement.width) * (this.xBounds[1] - this.xBounds[0]) +
      this.xBounds[0];

    const y =
      ((this.canvasElement.height - d[1]) / this.canvasElement.height) *
        (this.yBounds[1] - this.yBounds[0]) +
      this.yBounds[0];

    return {
      x,
      y
    };
  }

  clear() {
    this.ctx.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
  }

  private renderScatter(dataset: Dataset) {
    if (dataset.style) {
      this.ctx.fillStyle = dataset.style;
    }
    for (let d of dataset.data) {
      const [x, y] = this.scale(d);
      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  private renderLine(dataset: Dataset) {
    if (dataset.style) {
      this.ctx.strokeStyle = dataset.style;
      this.ctx.lineWidth = 2;
    }
    this.ctx.beginPath();
    for (let d of dataset.data) {
      const [x, y] = this.scale(d);
      this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
  }

  destroy() {
    if (this.clickInteraction) {
      this.clickInteraction.destroy();
    }
    this.canvasElement.remove();
  }

  render() {
    this.clear();
    for (let dataset of this.datasets) {
      if (dataset.type === "scatter") {
        this.renderScatter(dataset);
      } else {
        this.renderLine(dataset);
      }
    }
  }
}

export default Plot;
