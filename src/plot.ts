import { ClickInteraction } from "./interaction";
import { Axis } from "./axis";

export interface Datum {
  x: number;
  y: number;
}

export interface Style {
  strokeStyle?: string;
  strokeDashArray?: number[];
  strokeWidth: number;
  fillStyle?: string;
}

export interface Dataset {
  data: Datum[];
  type: "scatter" | "line";
  style?: Style;
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
  private ctx: CanvasRenderingContext2D;
  private clickInteraction: ClickInteraction;
  private datasets?: Dataset[] = [];
  xAxis: Axis;
  yAxis: Axis;
  private dpi: number;

  constructor(options: PlotOptions) {
    this.canvasElement = document.createElement("canvas");
    options.targetElement.appendChild(this.canvasElement);
    this.ctx = this.canvasElement.getContext("2d");
    this.dpi = window.devicePixelRatio || 1;
    this.ctx.scale(this.dpi, this.dpi);
    this.canvasElement.width = options.targetElement.clientWidth * this.dpi;
    this.canvasElement.style.width = "100%";
    this.canvasElement.height = options.targetElement.clientHeight * this.dpi;

    // assumes single axis for x and y for now
    this.xAxis = new Axis({
      pixelExtent: this.canvasElement.width,
      dpi: this.dpi,
      orientation: "x"
    });

    this.yAxis = new Axis({
      pixelExtent: this.canvasElement.height,
      dpi: this.dpi,
      orientation: "y"
    });

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

  private onDatasetChange() {
    const xValues = this.datasets
      .map(x => x.data.map(v => v.x))
      .reduce((acc, val) => acc.concat(val), []);
    this.xAxis.setDomainFromValues(xValues);

    const yValues = this.datasets
      .map(x => x.data.map(v => v.y))
      .reduce((acc, val) => acc.concat(val), []);
    this.yAxis.setDomainFromValues(yValues);
  }

  addDataset(d: Dataset) {
    this.datasets.push(d);
    this.onDatasetChange();
  }

  setDatasets(d: Dataset[]) {
    this.datasets = d;
    this.onDatasetChange();
  }

  clear() {
    this.ctx.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
  }

  /**
   * Modifies canvas context to match the style object
   * @param style
   */
  private setStyle(style: Style) {
    if (style.fillStyle) {
      this.ctx.strokeStyle = style.fillStyle;
    }
    if (style.strokeWidth) {
      this.ctx.lineWidth = style.strokeWidth;
    }
    if (style.fillStyle) {
      this.ctx.fillStyle = style.fillStyle;
    }
    if (style.strokeDashArray) {
      this.ctx.setLineDash(style.strokeDashArray);
    }
  }

  private renderScatter(dataset: Dataset) {
    if (dataset.style) {
      this.setStyle(dataset.style);
    }
    for (let d of dataset.data) {
      const x = this.xAxis.scale(d.x);
      const y = this.yAxis.scale(d.y);
      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  private renderLine(dataset: Dataset) {
    if (dataset.style) {
      this.setStyle(dataset.style);
    }
    this.ctx.beginPath();
    for (let d of dataset.data) {
      const x = this.xAxis.scale(d.x);
      const y = this.yAxis.scale(d.y);
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
