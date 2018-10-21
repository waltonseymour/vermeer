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

  constructor(options: VermeerOptions) {
    this.canvasElement = options.canvasElement;
    this.ctx = this.canvasElement.getContext("2d");
    this.datasets = options.datasets;
  }

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

  render() {
    // determine the min and max of x and y

    const xBounds = this.bounds("x");
    const yBounds = this.bounds("y");
  }
}
