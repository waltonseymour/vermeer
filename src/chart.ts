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

/**
 * Plot is an object that represents a dataset and how to visualize it
 */
export interface Plot {
  data: Datum[];
  type: "scatter" | "line";
  style?: Style;
}

/**
 * ChartOptions describes the options needed to initalize a Chart
 */
interface ChartOptions {
  targetElement: HTMLDivElement;
  plots?: Plot[];
  onClick?: (d: Datum) => void;
}

/**
 * Chart is the top level object for interacting with vermeer
 * @example const myChart = new Chart(options)
 */
export class Chart {
  canvasElement: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private clickInteraction: ClickInteraction;
  private plots?: Plot[] = [];
  xAxis: Axis;
  yAxis: Axis;
  private dpi: number;

  constructor(options: ChartOptions) {
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

    if (options.plots) {
      this.setPlots(options.plots);
    }

    if (options.onClick) {
      this.clickInteraction = new ClickInteraction({
        plot: this,
        handler: options.onClick
      });
    }
  }

  private onPlotChange() {
    const xValues = this.plots
      .map(x => x.data.map(v => v.x))
      .reduce((acc, val) => acc.concat(val), []);
    this.xAxis.setDomainFromValues(xValues);

    const yValues = this.plots
      .map(x => x.data.map(v => v.y))
      .reduce((acc, val) => acc.concat(val), []);
    this.yAxis.setDomainFromValues(yValues);
  }

  /**
   * Add a plot to the Chart
   * @param p the Plot to add
   */
  addPlot(p: Plot) {
    this.plots.push(p);
    this.onPlotChange();
  }

  /**
   * Set the plots for the Chart
   * @param p the Plots to be set
   */
  setPlots(p: Plot[]) {
    this.plots = p;
    this.onPlotChange();
  }

  private clear() {
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
    if (style.strokeStyle) {
      this.ctx.strokeStyle = style.strokeStyle;
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

  private renderScatter(plot: Plot) {
    if (plot.style) {
      this.setStyle(plot.style);
    }
    for (let d of plot.data) {
      const x = this.xAxis.scale(d.x);
      const y = this.yAxis.scale(d.y);
      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  private renderLine(plot: Plot) {
    if (plot.style) {
      this.setStyle(plot.style);
    }
    this.ctx.beginPath();
    for (let d of plot.data) {
      const x = this.xAxis.scale(d.x);
      const y = this.yAxis.scale(d.y);
      this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
  }

  /**
   * destroy will clean up all resources used for the Chart
   */
  destroy() {
    if (this.clickInteraction) {
      this.clickInteraction.destroy();
    }
    this.canvasElement.remove();
  }

  /**
   * render will draw the Chart to the canvas
   */
  render() {
    this.clear();
    for (let plot of this.plots) {
      if (plot.type === "scatter") {
        this.renderScatter(plot);
      } else {
        this.renderLine(plot);
      }
    }
  }
}

export default Chart;
