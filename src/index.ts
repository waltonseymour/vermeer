interface Datum {
  x: number;
  y: number;
}

interface VermeerOptions {
  canvasElement: HTMLCanvasElement;
  datasets: Datum[][];
}

/**
 * Vermeer is a HTML Canvas based charting library
 */
export class Vermeer {
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  datasets: any[][];
  xBounds: [number, number];
  yBounds: [number, number];

  constructor(options: VermeerOptions) {
    this.canvasElement = options.canvasElement;
    this.ctx = this.canvasElement.getContext("2d");
    this.datasets = options.datasets;
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
      for (let d of dataset) {
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

  scale(d: Datum): [number, number] {
    const xPixels =
      ((d.x - this.xBounds[0]) / (this.xBounds[1] - this.xBounds[0])) *
      this.canvasElement.width;

    const yPixels =
      ((d.y - this.yBounds[0]) / (this.yBounds[1] - this.yBounds[0])) *
      this.canvasElement.height;

    return [Math.round(xPixels), Math.round(yPixels)];
  }

  render() {}
}
