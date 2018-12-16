import Vermeer, { Datum, Plot } from "./index";

interface InteractionOptions {
  plot: Plot;
  handler: (point: Datum) => void;
}

export class ClickInteraction {
  plot: Vermeer;
  handler: (d: Datum) => void;

  constructor(options: InteractionOptions) {
    this.handler = options.handler;
    this.plot = options.plot;
    this.plot.canvasElement.addEventListener("click", this.handle);
  }

  handle = (e: MouseEvent) => {
    this.handler(this.plot.reverseScale([e.x, e.y]));
  };

  destroy() {
    this.plot.canvasElement.removeEventListener("click", this.handle);
  }
}
