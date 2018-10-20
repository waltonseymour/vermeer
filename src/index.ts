interface Datum {
  x: number;
  y: number;
}

interface FabricOptions {
  datasets: Datum[][];
}

/**
 * Fabric is a HTML Canvas based charting library
 */
export class Fabric {
  elt: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  datasets: any[][];

  constructor(options: FabricOptions) {
    this.elt = document.createElement("canvas");
    this.ctx = this.elt.getContext("2d");
    this.datasets = options.datasets;
  }

  bounds(property: "x" | "y"): [number, number] {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (let dataset of this.datasets) {
      for (let d of dataset) {
        if (d.x > max) {
          max = d[property];
        }

        if (d.x < min) {
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
