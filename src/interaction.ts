import { Datum, Chart } from "./chart";

interface InteractionOptions {
  plot: Chart;
  handler: (point: Datum) => void;
}

export class ClickInteraction {
  plot: Chart;
  handler: (d: Datum) => void;

  constructor(options: InteractionOptions) {
    this.handler = options.handler;
    this.plot = options.plot;
    this.plot.canvasElement.addEventListener("click", this.handle);
  }

  handle = (e: MouseEvent) => {
    const x = this.plot.xAxis.reverseScale(e.x);
    const y = this.plot.yAxis.reverseScale(e.y);
    this.handler({ x, y });
  };

  destroy() {
    this.plot.canvasElement.removeEventListener("click", this.handle);
  }
}
