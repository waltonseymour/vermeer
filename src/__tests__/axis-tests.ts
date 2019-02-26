import { Axis } from "../axis";

describe("axis", () => {
  it("should compute extent", () => {
    const xAxis = new Axis({
      orientation: "x",
      pixelExtent: 50,
      dpi: 1
    });

    expect(xAxis.extentOfValues([4, 3, 2, 1, 5])).toEqual([0.92, 5.08]);
  });

  it("should scale correctly", () => {
    const xAxis = new Axis({
      orientation: "x",
      pixelExtent: 50,
      dpi: 1
    });
    xAxis.setDomainFromValues([1, 2, 3, 4, 5, 6]);

    // should be 11 pixels to the right
    expect(xAxis.scale(2)).toEqual(11);

    const yAxis = new Axis({
      orientation: "y",
      pixelExtent: 50,
      dpi: 1
    });
    yAxis.setDomainFromValues([1, 2, 3, 4, 5, 6]);

    // should be 39 pixels from the top
    expect(yAxis.scale(2)).toEqual(39);
  });

  it("should reverseScale correctly", () => {
    const xAxis = new Axis({
      orientation: "x",
      pixelExtent: 50,
      dpi: 1
    });
    xAxis.setDomainFromValues([1, 2, 3, 4, 5, 6]);

    const translated = xAxis.reverseScale(10);
    expect(translated).toBeCloseTo(1.94);
  });
});
