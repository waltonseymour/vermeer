import { Vermeer } from "../index";

const datasets = [[{ x: 2, y: 3 }, { x: 3, y: 23 }]];
const canvasElement = {
  getContext: jest.fn(),
  height: 20,
  width: 20
};

describe("Vermeer", () => {
  it("should initialize without error", () => {
    new Vermeer({
      datasets,
      // @ts-ignore
      canvasElement
    });
  });

  it("should compute bounds", () => {
    const v = new Vermeer({
      datasets,
      // @ts-ignore
      canvasElement
    });

    expect(v.bounds("x")).toEqual([2, 3]);
    expect(v.bounds("y")).toEqual([3, 23]);
  });
});
