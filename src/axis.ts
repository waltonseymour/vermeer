export interface AxisOptions {
  orientation: "x" | "y";
  pixelExtent: number;
  dpi: number;
}

export class Axis {
  domain: [number, number];
  orientation: "x" | "y";
  pixelExtent: number;
  dpi: number;

  constructor(options: AxisOptions) {
    this.orientation = options.orientation;
    this.pixelExtent = options.pixelExtent;
    this.dpi = options.dpi;
  }

  /**
   * extentOfValues returns the [min, max] for the values present in the current datasets
   * @param property is "x" or "y" for the specified axis
   */
  extentOfValues(values: number[]): [number, number] {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (let d of values) {
      if (d > max) {
        max = d;
      }

      if (d < min) {
        min = d;
      }
    }

    return [min, max];
  }

  setDomain(values: number[]) {
    this.domain = this.extentOfValues(values);
  }

  /**
   * scale returns the pixel location for a datum given the bounds and canvasElement dimmensions.
   * @param d Datum to scale
   */
  scale(d: number): number {
    const pixels =
      ((d - this.domain[0]) / (this.domain[1] - this.domain[0])) *
      this.pixelExtent;

    if (this.orientation === "y") {
      return Math.round(this.pixelExtent - pixels);
    }
    return Math.round(pixels);
  }

  /**
   * reverseScale returns the translated value for a given pixel coordinate.
   * @param d Datum to scale
   */
  reverseScale(d: number): number {
    d *= this.dpi;

    if (this.orientation === "y") {
      return (
        ((this.pixelExtent - d) / this.pixelExtent) *
          (this.domain[1] - this.domain[0]) +
        this.domain[0]
      );
    }

    return (
      (d / this.pixelExtent) * (this.domain[1] - this.domain[0]) +
      this.domain[0]
    );
  }
}
